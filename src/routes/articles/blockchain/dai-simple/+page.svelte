<script lang="ts">
	import { onMount } from 'svelte';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import 'highlight.js/styles/github-dark.css';

	import '$lib/styles/article.css';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import InlinedCode from '$lib/components/InlinedCode.svelte';

	hljs.registerLanguage('javascript', javascript);

	// ── Code snippets ──────────────────────────────────────────────────────────

	const positionStructCode = `struct Position {
    uint256 collateral;  // amount of collateral token locked
    uint256 debt;        // debt *shares* (not actual DAI)
}

mapping(address user => Position position) positions;`;

	const constructorCode = `constructor(address initAsset, address initOracle, address initDAI, address initSwap, uint256 initThreshold) {
    ASSET     = IERC20(initAsset);
    DAI       = IDAI(initDAI);
    oracle    = IOracle(initOracle);
    swapContract = ISwap(initSwap);

    threshold  = initThreshold;          // e.g. 0.7e18  → 70 % LTV
    rateAcc    = MathLib.WAD;            // starts at 1e18
    rateFee    = 1000000001547125957;    // ~5 % APY per-second multiplier
    updatedAt  = block.timestamp;
    liquidationBonus = 0.05e18;          // 5 %
}`;

	const depositCode = `function deposit(uint256 amount) external {
    require(amount > 0, ErrorsLib.ZeroAmount());

    // Pull collateral from caller into the engine
    ASSET.safeTransferFrom(msg.sender, address(this), amount);
    positions[msg.sender].collateral += amount;
}`;

	const accrueInterestCode = `function accrueInterest() public {
    if (block.timestamp == updatedAt) return;   // nothing to do

    uint256 elapsed = block.timestamp - updatedAt;
    // rateAcc grows each second: rateAcc = rateAcc * rateFee^elapsed
    rateAcc   = MathLib.mulWadDown(MathLib.rpow(rateFee, elapsed, MathLib.WAD), rateAcc);
    updatedAt = block.timestamp;
}

// Debt shares → actual DAI owed
function debtToDai(uint256 debt) internal view returns (uint256) {
    uint256 amount = MathLib.mulWadDown(debt, rateAcc);  // debt * rateAcc
    return amount * DAI_BASE / MathLib.WAD;
}`;

	const borrowCode = `function borrow(uint256 debt) external {
    accrueInterest();                       // 1. update interest first
    require(debt > 0, ErrorsLib.ZeroAmount());

    uint256 daiAmount = debtToDai(debt);    // 2. convert shares → DAI

    // 3. check collateral is sufficient
    uint256 collateralValue =
        MathLib.mulDivDown(positions[msg.sender].collateral, oracle.price(), oracle.SCALE_FACTOR());
    uint256 maxDai     = MathLib.mulWadDown(collateralValue, threshold);
    uint256 currentDebt = debtToDai(positions[msg.sender].debt);
    require(currentDebt + daiAmount <= maxDai, ErrorsLib.ExceedThreshold());

    // 4. record debt as shares and mint DAI to caller
    positions[msg.sender].debt += debt;
    DAI.mint(msg.sender, daiAmount);
}`;

	const repayCode = `function repay(uint256 debt) external {
    accrueInterest();                       // 1. update interest first
    require(debt > 0, ErrorsLib.ZeroAmount());

    uint256 daiAmount = debtToDai(debt);    // 2. convert shares → DAI (includes accrued interest)

    // 3. reduce debt and burn the DAI from caller
    positions[msg.sender].debt -= debt;
    DAI.burn(msg.sender, daiAmount);
}`;

	const withdrawCode = `function withdraw(uint256 amount) external {
    accrueInterest();                       // 1. update interest first
    require(amount > 0, ErrorsLib.ZeroAmount());

    // 2. tentatively remove collateral
    positions[msg.sender].collateral -= amount;

    // 3. verify the remaining collateral still covers existing debt
    uint256 collateralValue =
        MathLib.mulDivDown(positions[msg.sender].collateral, oracle.price(), oracle.SCALE_FACTOR());
    uint256 maxDai      = MathLib.mulWadDown(collateralValue, threshold);
    uint256 currentDebt = debtToDai(positions[msg.sender].debt);
    require(currentDebt <= maxDai, ErrorsLib.ExceedThreshold());

    // 4. transfer collateral back to caller
    ASSET.safeTransfer(msg.sender, amount);
}`;

	const liquidateCode = `function liquidate(address borrower, uint256 debt, uint256 seizedCollateral) external {
    accrueInterest();

    // Exactly one of debt / seizedCollateral must be non-zero
    require((debt == 0) != (seizedCollateral == 0), ErrorsLib.InvalidInput());

    // 1. confirm position is unhealthy
    uint256 collateralValue =
        MathLib.mulDivDown(positions[borrower].collateral, oracle.price(), oracle.SCALE_FACTOR());
    uint256 maxDai      = MathLib.mulWadDown(collateralValue, threshold);
    uint256 currentDebt = debtToDai(positions[borrower].debt);
    require(currentDebt > maxDai, ErrorsLib.PositionHealthy());

    uint256 daiAmount;
    uint256 debtShares;

    if (debt > 0) {
        // Mode A: caller specifies debt shares to cover → engine computes collateral
        debtShares = debt;
        daiAmount  = debtToDai(debt);
        uint256 computed = MathLib.mulDivDown(
            MathLib.mulWadDown(daiAmount, MathLib.WAD + liquidationBonus),
            oracle.SCALE_FACTOR(), oracle.price()
        );
        require(computed <= positions[borrower].collateral, ErrorsLib.ExceedCollateral());
        seizedCollateral = computed;
    } else {
        // Mode B: caller specifies collateral to seize → engine computes debt
        require(seizedCollateral <= positions[borrower].collateral, ErrorsLib.ExceedCollateral());
        daiAmount = MathLib.mulDivDown(
            MathLib.mulDivDown(seizedCollateral, oracle.price(), oracle.SCALE_FACTOR()),
            MathLib.WAD, MathLib.WAD + liquidationBonus
        );
        debtShares = MathLib.mulDivDown(
            MathLib.mulDivDown(daiAmount, MathLib.WAD, rateAcc),
            MathLib.WAD, DAI_BASE
        );
    }

    // 2. update position
    positions[borrower].debt       -= debtShares;
    positions[borrower].collateral -= seizedCollateral;

    // 3. liquidator pays DAI and receives collateral + 5 % bonus
    DAI.burn(msg.sender, daiAmount);
    ASSET.safeTransfer(msg.sender, seizedCollateral);

    // 4. bad-debt path: all collateral gone but debt still remains
    if (positions[borrower].collateral == 0 && positions[borrower].debt > 0) {
        uint256 badDebt = debtToDai(positions[borrower].debt);
        positions[borrower].debt = 0;
        swapContract.swap(badDebt);   // socialize the loss
    }
}`;

	onMount(() => {
		hljs.highlightAll();
	});
</script>

<svelte:head>
	<title>How a Collateralized Stablecoin Works: A Code Walkthrough</title>
	<meta
		name="description"
		content="MakerDAO's DAI is powerful but complex. This article walks through a simplified implementation to explain exactly how collateralized stablecoins work — deposit, borrow, repay, withdraw, and liquidate."
	/>
</svelte:head>

<article class="article-container">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<header class="article-header">
			<div class="article-meta">
				<span class="article-category">Blockchain</span>
				<span>•</span>
				<time datetime="2026-02-28">February 28, 2026</time>
				<span>•</span>
				<span>15 min read</span>
			</div>
			<h1 class="article-title">How a Collateralized Stablecoin Works: A Code Walkthrough</h1>
			<p class="article-subtitle">
				A simplified walkthrough of MakerDAO's collateralized stablecoin system — so you can
				understand how algorithmic DAI actually works under the hood.
			</p>
		</header>

		<!-- What you will learn -->
		<section class="feature-grid">
			<h2 class="article-section-title">What you will learn</h2>
			<div class="feature-grid-items">
				<div class="feature-item">
					<h3 class="feature-item-title">System Overview</h3>
					<p class="feature-item-text">
						How to mint stablecoin through the process of depositing collateral
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Interest Model</h3>
					<p class="feature-item-text">
						Borrowers who mint DAI pay a continuous stability fee — the interest that accrues on
						their debt — which keeps the system solvent and the peg intact
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Core Operations</h3>
					<p class="feature-item-text">The core operations that happens on the system</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Liquidations & Bad Debt</h3>
					<p class="feature-item-text">
						The critical operations that recover the DAI price in case of depeg
					</p>
				</div>
			</div>
		</section>

		<!-- Content -->
		<div class="article-content">
			<!-- Introduction -->
			<section class="article-section">
				<h2 class="article-section-title">Introduction</h2>
				<p class="article-text">
					Most stablecoins today — USDC, USDT — are issued and controlled by centralized operators.
					<InlinedCode variable="DAI" color="purple" strong />, built by
					<InlinedCode variable="MakerDAO" color="purple" strong href="https://sky.money/" />, takes
					a different approach: it is decentralized, backed by on-chain collateral, and governed by
					code rather than a corporation.
				</p>
				<p class="article-text">
					The core idea is straightforward — lock up crypto, mint <InlinedCode
						variable="DAI"
						strong
						color="purple"
					/> pegged to $1, and the protocol enforces solvency through over-collateralization and open
					liquidations. But the <InlinedCode
						variable="production codebase"
						color="green"
						strong
						href="https://github.com/sky-ecosystem/dss"
					></InlinedCode>
					is anything but simple: it spans dozens of contracts, annoyed naming, has assembly-level math,
					and years of governance complexity layered on top.
				</p>
				<p class="article-text">
					To cut through that, I wrote
					<InlinedCode
						variable="dai-simple"
						color="green"
						strong
						href="https://github.com/anhoangphuc/dai-simple"
					/>, a single-contract re-implementation with the same core mechanics and none of the
					noise. No governance, no multi-collateral support — just the essential logic of a
					<strong>CDP (Collateralized Debt Position)</strong> system.
				</p>
				<p class="article-text">
					This article walks through each operation in order: deposit → borrow → repay → withdraw,
					and finally liquidation — what happens when a position becomes undercollateralized.
				</p>
			</section>

			<!-- System Overview -->
			<section class="article-section">
				<h2 class="article-section-title">System Overview</h2>
				<p class="article-text">
					The system is made up of four contracts that each play a distinct role:
				</p>

				<div class="mt-4 overflow-x-auto">
					<table class="w-full border-collapse overflow-hidden rounded-lg bg-white shadow-md">
						<thead>
							<tr class="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
								<th class="px-4 py-3 text-left text-sm font-semibold">Contract</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">Role</th>
							</tr>
						</thead>
						<tbody class="text-sm">
							<tr class="border-b border-slate-200 hover:bg-slate-50">
								<td class="px-4 py-3 font-mono font-semibold text-purple-700">DaiEngine.sol</td>
								<td class="px-4 py-3 text-slate-700"
									>The core CDP engine. Handles all user interactions and enforces all rules.</td
								>
							</tr>
							<tr class="border-b border-slate-200 hover:bg-slate-50">
								<td class="px-4 py-3 font-mono font-semibold text-blue-700">DAIToken.sol</td>
								<td class="px-4 py-3 text-slate-700"
									>A standard ERC-20 stablecoin. Only the engine can mint or burn it.</td
								>
							</tr>
							<tr class="border-b border-slate-200 hover:bg-slate-50">
								<td class="px-4 py-3 font-mono font-semibold text-green-700">Oracle.sol</td>
								<td class="px-4 py-3 text-slate-700"
									>Reports the USD price of the collateral token, scaled by 1e18.</td
								>
							</tr>
							<tr class="hover:bg-slate-50">
								<td class="px-4 py-3 font-mono font-semibold text-orange-700">SwapContract.sol</td>
								<td class="px-4 py-3 text-slate-700"
									>Absorbs bad debt when a liquidation cannot fully cover outstanding DAI.</td
								>
							</tr>
						</tbody>
					</table>
				</div>

				<p class="article-text mt-6">
					Every user position is stored in a single <InlinedCode
						variable="Position"
						color="purple"
					/> struct inside the engine:
				</p>

				<div class="my-4">
					<CodeBlock code={positionStructCode} language="javascript" filename="DaiEngine.sol" />
				</div>

				<p class="article-text">
					Notice that <InlinedCode variable="debt" color="purple" /> is stored as <em>shares</em>,
					not as raw DAI. We will see why in the next section. The key parameters set at deployment
					are:
				</p>

				<div class="mt-4 overflow-x-auto">
					<table class="w-full border-collapse overflow-hidden rounded-lg bg-white shadow-md">
						<thead>
							<tr class="bg-gradient-to-r from-indigo-700 to-purple-600 text-white">
								<th class="px-4 py-3 text-left text-sm font-semibold">Parameter</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">Value</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">Meaning</th>
							</tr>
						</thead>
						<tbody class="text-sm">
							<tr class="border-b border-slate-200 hover:bg-indigo-50">
								<td class="px-4 py-3 font-mono font-semibold text-indigo-700">threshold</td>
								<td class="px-4 py-3 font-mono text-slate-700">0.7e18</td>
								<td class="px-4 py-3 text-slate-700">Max DAI mintable = 70% of collateral value</td>
							</tr>
							<tr class="border-b border-slate-200 hover:bg-indigo-50">
								<td class="px-4 py-3 font-mono font-semibold text-indigo-700">rateAcc</td>
								<td class="px-4 py-3 font-mono text-slate-700">1e18 (starts)</td>
								<td class="px-4 py-3 text-slate-700"
									>Global borrow index, always increasing as interest accrues</td
								>
							</tr>
							<tr class="border-b border-slate-200 hover:bg-indigo-50">
								<td class="px-4 py-3 font-mono font-semibold text-indigo-700">rateFee</td>
								<td class="px-4 py-3 font-mono text-slate-700">1000000001547125957</td>
								<td class="px-4 py-3 text-slate-700"
									>Per-second multiplier ≈ 5% APY compound interest</td
								>
							</tr>
							<tr class="hover:bg-indigo-50">
								<td class="px-4 py-3 font-mono font-semibold text-indigo-700">liquidationBonus</td>
								<td class="px-4 py-3 font-mono text-slate-700">0.05e18</td>
								<td class="px-4 py-3 text-slate-700"
									>5% extra collateral given to liquidators as an incentive</td
								>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="my-4">
					<CodeBlock
						code={constructorCode}
						language="javascript"
						filename="DaiEngine.sol — constructor"
						maxLines={15}
					/>
				</div>
			</section>

			<!-- Interest Model -->
			<section class="article-section">
				<h2 class="article-section-title">The Interest Model: Debt Shares and rateAcc</h2>
				<p class="article-text">
					Before we look at the individual operations, it is important to understand how interest
					works — because every state-changing function calls <InlinedCode
						variable="accrueInterest()"
						color="green"
					/> as its very first step.
				</p>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Why store debt shares instead of DAI?</h3>
					<p class="article-text">
						If we stored each borrower's debt as a raw DAI amount, we would need to iterate over
						every position every second to add interest — which is gas-prohibitive on Ethereum.
					</p>
					<p class="article-text">
						Instead Compound use the same technique as <InlinedCode
							variable="Compound"
							color="blue"
						/>: a global borrow index called <InlinedCode variable="rateAcc" color="purple" />. When
						you borrow, your debt is stored as <em>shares</em> of the current index. When you repay
						(or get liquidated), those shares are converted back to DAI at the <em>current</em>
						index, which has grown over time. The interest is captured automatically, with no loops.
					</p>

					<div class="example-box example-box-indigo my-6">
						<div class="example-box-header">Concrete Example</div>
						<div class="example-box-content text-sm text-slate-700">
							<p class="mb-3">
								Suppose you borrow when <InlinedCode variable="rateAcc = 1e18" color="purple" />.
								You want 1000 DAI, so the engine records
								<InlinedCode variable="debt = 1000 shares" color="indigo" />.
							</p>
							<p class="mb-3">
								One year later, interest has grown <InlinedCode variable="rateAcc" color="purple" />
								to <InlinedCode variable="1.05e18" color="purple" /> (~5% APY). Now:
							</p>
							<p class="mb-2 font-mono text-slate-800">
								debtToDai(1000) = 1000 × 1.05e18 / 1e18 = <span class="font-bold text-red-700"
									>1050 DAI</span
								>
							</p>
							<p class="text-slate-600 italic">
								You owe 50 DAI more than you borrowed — the stability fee, collected automatically.
							</p>
						</div>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">How rateAcc grows</h3>
					<p class="article-text">
						<InlinedCode variable="accrueInterest()" color="green" /> uses compound exponentiation (<InlinedCode
							variable="rpow"
							color="gray"
						/>) to grow the index by
						<InlinedCode variable="rateFee^elapsed_seconds" color="purple" />:
					</p>
					<div class="my-4">
						<CodeBlock
							code={accrueInterestCode}
							language="javascript"
							filename="DaiEngine.sol — accrueInterest & debtToDai"
						/>
					</div>
					<p class="article-text">
						Because <InlinedCode variable="rateAcc" color="purple" /> is a shared global, all existing
						borrowers pay the same rate. No per-user update is needed. And since
						<InlinedCode variable="accrueInterest()" color="green" /> is called at the start of every
						mutating function, the index is always up-to-date before any balance changes.
					</p>
				</div>
			</section>

			<!-- 1. Deposit -->
			<section class="article-section">
				<h2 class="article-section-title">1. Deposit — Locking Collateral</h2>
				<p class="article-text">
					Everything starts with depositing collateral. This is the simplest operation: no interest
					accrual is needed, no health check is required. The engine just pulls the tokens in and
					records them.
				</p>

				<div class="my-4">
					<CodeBlock code={depositCode} language="javascript" filename="DaiEngine.sol — deposit" />
				</div>

				<p class="article-text mt-4">
					After this call, <InlinedCode variable="positions[user].collateral" color="purple" />
					increases. The user now has "buying power" to mint DAI.
				</p>
			</section>

			<!-- 2. Borrow -->
			<section class="article-section">
				<h2 class="article-section-title">2. Borrow — Minting DAI</h2>
				<p class="article-text">
					With collateral locked, the user can mint DAI. The engine computes the maximum DAI
					allowed, checks the new debt does not exceed it, and mints.
				</p>

				<div class="my-4">
					<CodeBlock code={borrowCode} language="javascript" filename="DaiEngine.sol — borrow" />
				</div>

				<p class="article-text">
					The collateral check uses three values in sequence, which is worth spelling out clearly:
				</p>

				<ol class="article-list decimal ml-4 space-y-2">
					<li>
						<strong>Collateral value in USD</strong> — multiply the raw collateral token amount by
						the oracle price and divide by the oracle's scale factor (<InlinedCode
							variable="1e18"
							color="gray"
						/>).
					</li>
					<li>
						<strong>Maximum DAI</strong> — multiply that USD value by the 70% threshold. So if your collateral
						is worth $10,000, you can borrow at most $7,000 of DAI.
					</li>
					<li>
						<strong>Current debt in DAI</strong> — convert existing debt shares to DAI at the
						current <InlinedCode variable="rateAcc" color="purple" />. This already includes accrued
						interest, because we called <InlinedCode variable="accrueInterest()" color="green" /> first.
					</li>
				</ol>

				<div class="example-box example-box-green my-6">
					<div class="example-box-header">Example: First Borrow</div>
					<div class="example-box-content text-sm text-slate-700">
						<ul class="space-y-2">
							<li>
								Collateral: <InlinedCode variable="5 tokens" color="gray" />, oracle price:
								<InlinedCode variable="$2,000" color="green" />
							</li>
							<li>
								Collateral value: 5 × 2000 = <InlinedCode variable="$10,000" color="green" />
							</li>
							<li>
								Max DAI (70%): <InlinedCode variable="$7,000 DAI" color="green" />
							</li>
							<li>Existing debt: 0</li>
							<li>
								You may borrow up to: <InlinedCode variable="7,000 DAI" color="green" strong />
							</li>
						</ul>
					</div>
				</div>

				<p class="article-text">
					The <InlinedCode variable="debt" color="purple" /> parameter is passed as <em>shares</em>,
					not as a DAI amount. In practice, when <InlinedCode
						variable="rateAcc = 1e18"
						color="purple"
					/>
					(fresh system), shares and DAI are equal. As interest accrues and
					<InlinedCode variable="rateAcc" color="purple" /> grows above <InlinedCode
						variable="1e18"
						color="purple"
					/>, you need fewer shares to represent the same DAI.
				</p>
			</section>

			<!-- 3. Repay -->
			<section class="article-section">
				<h2 class="article-section-title">3. Repay — Paying Back DAI</h2>
				<p class="article-text">
					Repaying is the mirror image of borrowing. The user burns DAI, and the engine reduces
					their debt shares. The key insight is that repaying more DAI than you originally borrowed
					is entirely expected — the extra covers the accrued interest.
				</p>

				<div class="my-4">
					<CodeBlock code={repayCode} language="javascript" filename="DaiEngine.sol — repay" />
				</div>

				<p class="article-text">
					Because <InlinedCode variable="accrueInterest()" color="green" /> runs first, the conversion
					<InlinedCode variable="debtToDai(debt)" color="green" /> returns the correct amount including
					all interest up to this block. If you borrowed 1000 DAI a year ago, you might burn 1050 DAI
					to clear the position.
				</p>
				<p class="article-text">
					This is also how the stability fee helps maintain the peg: borrowers who need extra DAI to
					cover interest must buy it on the open market, creating consistent demand that supports
					the $1 price.
				</p>

				<div class="mt-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
					<p class="text-sm font-semibold text-yellow-900">Partial repayment is fine</p>
					<p class="mt-1 text-sm text-yellow-800">
						You can pass any number of debt shares less than your total. The position stays open
						with the remaining shares. There is no minimum repayment amount beyond zero.
					</p>
				</div>
			</section>

			<!-- 4. Withdraw -->
			<section class="article-section">
				<h2 class="article-section-title">4. Withdraw — Retrieving Collateral</h2>
				<p class="article-text">
					Once you have repaid enough DAI, you can withdraw your collateral. Unlike deposit, this
					operation <em>can</em> violate the health ratio, so the engine performs a check after tentatively
					removing the collateral.
				</p>

				<div class="my-4">
					<CodeBlock
						code={withdrawCode}
						language="javascript"
						filename="DaiEngine.sol — withdraw"
					/>
				</div>

				<p class="article-text">
					Notice the order: the engine <em>subtracts the collateral first</em>, then checks whether
					the remaining position is still healthy. This optimistic update pattern avoids keeping a
					local copy of the pre-update value. If the check fails, the transaction reverts and the
					subtraction is rolled back — no state change persists.
				</p>

				<div class="example-box example-box-blue my-6">
					<div class="example-box-header">Example: Partial Withdrawal</div>
					<div class="example-box-content text-sm text-slate-700">
						<ul class="space-y-2">
							<li>
								Current collateral: <InlinedCode variable="5 tokens @ $2,000" color="blue" /> = $10,000
							</li>
							<li>
								Current debt: <InlinedCode variable="3,000 DAI" color="blue" />
							</li>
							<li>
								You try to withdraw <InlinedCode variable="2 tokens" color="blue" /> ($4,000)
							</li>
							<li>Remaining collateral value: $6,000 → max DAI at 70% = $4,200</li>
							<li>
								3,000 ≤ 4,200 → <span class="font-bold text-green-700">withdrawal succeeds ✓</span>
							</li>
						</ul>
						<div class="mt-3 border-t border-blue-200 pt-3">
							<p>Try withdrawing <InlinedCode variable="3 tokens" color="blue" /> instead:</p>
							<p class="mt-1">Remaining collateral value: $4,000 → max DAI = $2,800</p>
							<p>
								3,000 &gt; 2,800 → <span class="font-bold text-red-700"
									>ExceedThreshold revert ✗</span
								>
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- 5. Liquidate -->
			<section class="article-section">
				<h2 class="article-section-title">5. Liquidate — Closing Unhealthy Positions</h2>
				<p class="article-text">
					A position becomes unhealthy when the debt (including accrued interest) grows beyond
					threshold (70% in our example) of the collateral's USD value — either because interest
					piled up, or because the collateral price dropped. At that point, anyone can liquidate it.
				</p>

				<p class="article-text">
					The liquidator burns DAI to cover the debt and receives the borrower's collateral at a 5%
					discount. This discount is the liquidator's profit motive and ensures positions are closed
					quickly, protecting the DAI peg.
				</p>

				<p class="article-text">
					Without liquidation, unhealthy positions would linger and worsen. Eventually, the
					collateral backing a position would no longer cover the DAI minted against it — leaving
					unbacked DAI in circulation. That unbacked supply breaks the peg.
				</p>

				<div class="my-4">
					<CodeBlock
						code={liquidateCode}
						language="javascript"
						filename="DaiEngine.sol — liquidate"
						maxLines={25}
					/>
				</div>

				<div class="article-subsection mt-6">
					<h3 class="article-subsection-title">Two Liquidation Modes</h3>
					<p class="article-text">
						The function accepts two exclusive input modes, giving liquidators flexibility:
					</p>

					<div class="mt-4 overflow-x-auto">
						<table class="w-full border-collapse overflow-hidden rounded-lg bg-white shadow-md">
							<thead>
								<tr class="bg-gradient-to-r from-red-700 to-orange-600 text-white">
									<th class="px-4 py-3 text-left text-sm font-semibold">Mode</th>
									<th class="px-4 py-3 text-left text-sm font-semibold">You provide</th>
									<th class="px-4 py-3 text-left text-sm font-semibold">Engine computes</th>
									<th class="px-4 py-3 text-left text-sm font-semibold">Use when</th>
								</tr>
							</thead>
							<tbody class="text-sm">
								<tr class="border-b border-slate-200 hover:bg-red-50">
									<td class="px-4 py-3 font-semibold text-slate-800">Mode A</td>
									<td class="px-4 py-3 font-mono text-slate-700">debt shares</td>
									<td class="px-4 py-3 font-mono text-slate-700">collateral to seize</td>
									<td class="px-4 py-3 text-slate-600">You know how much DAI you want to burn</td>
								</tr>
								<tr class="hover:bg-red-50">
									<td class="px-4 py-3 font-semibold text-slate-800">Mode B</td>
									<td class="px-4 py-3 font-mono text-slate-700">seizedCollateral</td>
									<td class="px-4 py-3 font-mono text-slate-700">debt covered</td>
									<td class="px-4 py-3 text-slate-600">You know how much collateral you want</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="example-box example-box-pink my-6">
						<div class="example-box-header">Example: Liquidation Math (Mode A)</div>
						<div class="example-box-content text-sm text-slate-700">
							<ul class="space-y-2">
								<li>
									Collateral: <InlinedCode variable="1 token @ $1,800" color="pink" /> = $1,800 (price
									dropped from $2,000)
								</li>
								<li>Outstanding debt: <InlinedCode variable="1,500 DAI" color="pink" /></li>
								<li>
									Max DAI at 70%: $1,260 → <span class="font-bold text-red-700">unhealthy</span>
								</li>
								<li class="border-t border-pink-200 pt-2">
									Liquidator covers <InlinedCode variable="500 DAI" color="pink" /> of debt:
								</li>
								<li>
									Collateral seized = 500 × (1 + 0.05) / 1800 =
									<InlinedCode variable="0.2917 collateral tokens" color="pink" strong />
								</li>
								<li>
									Liquidator profit: 0.2917 × $1,800 = $525 — paid $500 DAI, received $525 in
									collateral → <span class="font-bold text-green-700">$25 profit (5%)</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Bad Debt: When Collateral Runs Out</h3>
					<p class="article-text">
						In a severe price crash, a position's collateral value may fall below the outstanding
						debt before anyone liquidates it. In that case, seizing all the collateral still leaves
						DAI in circulation without backing — this is called <InlinedCode
							variable="bad debt"
							color="red"
							strong
						/>.
					</p>
					<p class="article-text">
						The engine handles this at the end of <InlinedCode
							variable="liquidate()"
							color="green"
						/>: if all collateral is seized and debt still remains, the leftover debt is forwarded
						to <InlinedCode variable="SwapContract" color="orange" />. In a production system this
						contract would mint a governance token, auction it, and use the proceeds to buy and burn
						the uncovered DAI — restoring the peg. In this simplified implementation it just records
						the total bad debt for observability.
					</p>

					<div class="mt-4 rounded-lg border-l-4 border-red-400 bg-red-50 p-4">
						<p class="text-sm font-semibold text-red-900">Why can bad debt occur?</p>
						<p class="mt-1 text-sm text-red-800">
							Liquidations are only profitable when there is a collateral surplus to capture. If the
							price drops faster than liquidators can act — for example during a flash crash — the
							collateral value may already be below the debt value by the time the transaction
							lands. The 5% liquidation bonus also means liquidators will not act until the debt
							exceeds the collateral by at least 5%, leaving a window where bad debt can accumulate.
						</p>
					</div>
				</div>
			</section>

			<!-- Full Flow Recap -->
			<section class="article-section">
				<h2 class="article-section-title">Putting It All Together</h2>
				<p class="article-text">
					Here is the lifecycle of a typical position from start to finish:
				</p>

				<div class="my-6 space-y-3">
					{#each [{ step: '1', label: 'Deposit', color: 'bg-blue-100 text-blue-800 border-blue-300', desc: 'Lock collateral. No health check needed. Collateral balance increases.' }, { step: '2', label: 'Borrow', color: 'bg-green-100 text-green-800 border-green-300', desc: 'Mint DAI ≤ 70% of collateral value. Debt recorded as shares at current rateAcc.' }, { step: '3', label: 'Interest accrues', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', desc: 'rateAcc grows each second. Debt in DAI terms quietly increases even with no action.' }, { step: '4', label: 'Repay', color: 'bg-purple-100 text-purple-800 border-purple-300', desc: 'Burn DAI (principal + interest). Debt shares decrease.' }, { step: '5', label: 'Withdraw', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', desc: 'Retrieve collateral. Remaining collateral must still cover remaining debt.' }, { step: '⚡', label: 'Liquidate (if unhealthy)', color: 'bg-red-100 text-red-800 border-red-300', desc: 'Third party burns DAI, seizes collateral + 5% bonus. Bad debt forwarded to SwapContract.' }] as item}
						<div class="flex items-start gap-4 rounded-lg border {item.color} p-4">
							<span
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm"
								>{item.step}</span
							>
							<div>
								<p class="font-semibold">{item.label}</p>
								<p class="mt-1 text-sm opacity-80">{item.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Conclusion -->
			<section class="article-section">
				<h2 class="article-section-title">Conclusion</h2>
				<p class="article-text">
					A collateralized stablecoin system is, at its core, a set of rules about when you can mint
					money and when you lose the right to your collateral. The five operations we covered —
					deposit, borrow, repay, withdraw, and liquidate — are all implementations of those rules,
					with compound interest woven throughout via the debt-share / borrow-index pattern.
				</p>
				<p class="article-text">
					The real MakerDAO adds a lot on top: multiple collateral types, a savings rate for DAI
					holders, on-chain governance, liquidation auctions, circuit breakers, and more. But every
					one of those features is built on the same foundation you just read through. Once you
					understand how a position opens, stays healthy, and gets closed, the rest is detail.
				</p>
				<p class="article-text">
					If you want to experiment, clone
					<InlinedCode
						variable="dai-simple"
						color="green"
						strong
						href="https://github.com/anhoangphuc/dai-simple"
					/> and run
					<InlinedCode variable="forge test -vvv" color="gray" />. The test files cover each
					scenario with concrete numbers — a great way to build intuition quickly.
				</p>
			</section>
		</div>
	</div>
</article>
