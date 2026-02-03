<script lang="ts">
	import { onMount } from 'svelte';
	import hljs from 'highlight.js/lib/core';
	import typescript from 'highlight.js/lib/languages/typescript';
	import 'highlight.js/styles/github-dark.css';
	import katex from 'katex';
	import 'katex/dist/katex.min.css';

	import '$lib/styles/article.css';
	import InlinedCode from '$lib/components/InlinedCode.svelte';

	hljs.registerLanguage('typescript', typescript);

	onMount(() => {
		hljs.highlightAll();

		// Render all math formulas
		const mathElements = document.querySelectorAll('.math-display, .math-inline');
		mathElements.forEach((el) => {
			const latex = el.getAttribute('data-latex') || el.textContent || '';
			katex.render(latex, el as HTMLElement, {
				throwOnError: false,
				displayMode: el.classList.contains('math-display')
			});
		});
	});
</script>

<svelte:head>
	<title>Understanding Impermanent Loss in AMMs: A Mathematical Approach</title>
	<meta
		name="description"
		content="A comprehensive mathematical guide to understanding impermanent loss in automated market makers and how it affects liquidity providers"
	/>
</svelte:head>

<article class="article-container">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<header class="article-header">
			<div class="article-meta">
				<span class="article-category">Blockchain</span>
				<span>•</span>
				<time datetime="2026-01-31">January 31, 2026</time>
				<span>•</span>
				<span>15 min read</span>
			</div>
			<h1 class="article-title">Impermanent Loss in AMMs: A Mathematical Approach</h1>
			<p class="article-subtitle">
				A comprehensive mathematical derivation of impermanent loss in automated market makers,
				going beyond the common explanations to show you exactly how much you can lose.
			</p>
		</header>

		<!-- Key Features -->
		<section class="feature-grid">
			<h2 class="article-section-title">What you will learn</h2>
			<div class="feature-grid-items">
				<div class="feature-item">
					<h3 class="feature-item-title">What is Impermanent Loss</h3>
					<p class="feature-item-text">
						Understand the concept of impermanent loss and why it's called "impermanent".
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Real Examples</h3>
					<p class="feature-item-text">
						See concrete examples with real numbers to understand the impact.
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Mathematical Foundation</h3>
					<p class="feature-item-text">
						Learn the mathematical basis for impermanent loss in constant product AMMs.
					</p>
				</div>
			</div>
		</section>

		<!-- Content -->
		<div class="article-content">
			<!-- Introduction Section -->
			<section class="article-section">
				<h2 class="article-section-title">Introduction</h2>
				<p class="article-text">
					You're probably familiar with <InlinedCode
						variable="Impermanent Loss"
						color="blue"
						strong
					/> (IL) in automated market makers like
					<InlinedCode variable="Uniswap" color="blue" strong /> or <InlinedCode
						variable="PancakeSwap"
						color="blue"
						strong
					/>. You know that when providing liquidity to an AMM, you can lose money if token prices
					change. But do you know <b><em>exactly</em></b> how much you'll lose? This article derives the
					precise mathematical formula for impermanent loss, showing you how to calculate your potential
					losses for any price movement.
				</p>

				<p class="article-text">
					We'll approach impermanent loss from three angles: first, a conceptual explanation of what
					it is; second, real-world examples with actual numbers; and finally, a complete
					mathematical proof showing why IL is inevitable and how to calculate it precisely.
				</p>
			</section>

			<!-- What is Impermanent Loss -->
			<section class="article-section">
				<h2 class="article-section-title">What is Impermanent Loss?</h2>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Quick Refresher</h3>
					<p class="article-text">
						Suppose ETH is currently priced at $2,000 USDC. You have ETH and USDC. Instead of
						letting your assets sit idle, you decide to provide them as liquidity to an <InlinedCode
							variable="ETH/USDC"
							color="blue"
							strong
						/> pool (for example, on <InlinedCode variable="Uniswap" color="blue" strong />) to earn
						trading fees.
					</p>
					<p class="article-text">
						After some time, you withdraw your assets from the pool and compare the value to if you
						had simply held your original tokens. You realize that the holding strategy would have
						given you more value. This difference is impermanent loss. Even if your pool position
						increased in value, you still "lost" compared to just holding.
					</p>
					<p class="article-text">
						When you provide liquidity, you're exposed to <InlinedCode
							variable="IL"
							color="blue"
							strong
						/>, and sometimes the trading fees you earn don't cover the impermanent loss you've
						incurred, resulting in a net loss.
					</p>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Why Does It Happen?</h3>
					<p class="article-text">
						When you provide liquidity to a pool, your tokens become available for traders to swap.
						Here's the sequence of events when market prices change:
					</p>
					<ol class="article-list decimal ml-4 space-y-1">
						<li>The real market price (on centralized exchanges like Binance) changes instantly</li>
						<li>The pool price lags behind because it only updates when someone trades</li>
						<li>
							This creates a price discrepancy—some tokens are now cheaper in the pool than on the
							market
						</li>
						<li>
							Arbitrageurs exploit this by buying cheap tokens from your pool and selling them at
							market price
						</li>
					</ol>
					<p class="article-text">
						The arbitrageurs pocket the profit from this price difference. Since your liquidity is
						on the losing side of these trades, you experience impermanent loss. The larger the
						price movement, the more arbitrageurs profit, and the more you lose.
					</p>

					<div class="example-box example-box-indigo mt-4">
						<div class="example-box-header">Example: ETH/USDC Pool with Arbitrage</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Initial State:</p>
							<ul class="article-list list-disc">
								<li>Pool has 10 ETH and 20,000 USDC</li>
								<li>Current price: 1 ETH = 2,000 USDC (both in pool and market)</li>
								<li>Liquidity constant (k): 10 × 20,000 = 200,000</li>
							</ul>

							<p class="mt-4 mb-2 font-semibold text-slate-900">
								When ETH price increases to $2,400 on external exchanges:
							</p>
							<ol class="article-list decimal">
								<li>The pool still prices ETH at $2,000 (hasn't updated yet)</li>
								<li class="mt-1">
									<strong>Arbitrageur sees the opportunity:</strong>
									<ul class="article-list mt-1 ml-4 list-disc">
										<li>Buys 0.871 ETH from the pool, paying 1,910 USDC</li>
										<li>Sells 0.871 ETH on Binance at $2,400 = $2,090.4</li>
										<li>
											<strong class="text-blue-700"
												>Arbitrageur profit: $2,090.4 - $1,910 = $180.4</strong
											>
										</li>
										<li>
											After arbitrage: Pool has ~9.129 ETH and ~21,910 USDC (price now $2,400,
											liquidity constant at 200,000)
										</li>
									</ul>
								</li>
							</ol>

							<p class="mt-4 mb-2 font-semibold text-slate-900">
								When ETH price decreases back to $2,000:
							</p>
							<ol class="article-list decimal">
								<li>The pool still prices ETH at $2,400 (overpriced)</li>
								<li class="mt-1">
									<strong>Arbitrageur sees the opportunity:</strong>
									<ul class="article-list mt-1 ml-4 list-disc">
										<li>Buys 0.871 ETH from exchanges at $2,000 = $1,742</li>
										<li>Sells 0.871 ETH to the pool, receiving 1,910 USDC</li>
										<li>
											<strong class="text-blue-700"
												>Arbitrageur profit: $1,910 - $1,742 = $168</strong
											>
										</li>
										<li>
											After arbitrage: Pool has 10 ETH and 20,000 USDC (price restored to $2,000,
											liquidity constant at 200,000)
										</li>
									</ul>
								</li>
							</ol>
							<div class="mt-4 rounded-lg border-2 border-slate-300 bg-slate-50 p-4">
								<p class="mb-3 font-semibold text-slate-900">
									📌 After the price returns to $2,000:
								</p>
								<ul class="space-y-2 text-sm text-slate-800">
									<li>
										<strong>Total arbitrageur profit:</strong> $180.4 + $168 =
										<span class="font-bold text-red-700">$348.4</span>
									</li>
									<li>
										<strong>Liquidity provider position:</strong> Restored to the original 10 ETH and
										20,000 USDC (impermanent loss = 0%)
									</li>
									<li class="border-t border-slate-300 pt-2">
										<strong class="text-blue-900">The key insight:</strong> If the liquidity
										provider had instead actively traded—selling 0.871 ETH at $2,400 and buying it
										back at $2,000—they would have earned 0.871 × ($2,400 - $2,000) =
										<strong class="text-green-700">$348.4</strong>
									</li>
									<li class="text-sm text-slate-700 italic">
										This $348.4 is exactly what the arbitrageurs captured from the pool! By
										passively providing liquidity, you give up the opportunity cost of profiting
										from price movements.
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Why Does It Happen -->
			<section class="article-section">
				<h2 class="article-section-title">Real-World Examples</h2>

				<p class="article-text">
					Let's examine four concrete examples showing exactly how much you lose from impermanent
					loss. In all cases, we start with the same position: 1 ETH + 2,000 USDC when ETH = $2,000
					(total value $4,000). We'll see how IL varies based on the magnitude of price changes.
				</p>

				<div class="mt-6 overflow-x-auto">
					<table class="w-full border-collapse overflow-hidden rounded-lg bg-white shadow-md">
						<thead>
							<tr class="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
								<th class="px-4 py-3 text-left text-sm font-semibold">Scenario</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">Price Change</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">Position in Pool</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">Pool Price</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">Pool Value</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">If Just Holding</th>
								<th class="px-4 py-3 text-left text-sm font-semibold">Holding Value</th>
								<th class="bg-red-800 px-4 py-3 text-left text-sm font-semibold"
									>Impermanent Loss</th
								>
							</tr>
						</thead>
						<tbody class="text-sm">
							<!-- Example 1: +20% -->
							<tr class="border-b border-slate-200 transition-colors hover:bg-green-50">
								<td class="px-4 py-4">
									<div class="font-semibold text-slate-900">Example 1</div>
									<div class="mt-1 text-xs text-slate-600">ETH price increases</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-green-700">+20%</div>
									<div class="text-xs text-slate-600">$2,000 → $2,400</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-mono text-xs">0.9129 ETH</div>
									<div class="font-mono text-xs">2,191 USDC</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-indigo-700">$2,400</div>
									<div class="font-mono text-xs text-slate-600">2,191 / 0.9129</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-blue-700">$4,382</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-mono text-xs">1 ETH</div>
									<div class="font-mono text-xs">2,000 USDC</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-green-700">$4,400</div>
								</td>
								<td class="bg-red-50 px-4 py-4">
									<div class="font-bold text-red-700">-$18</div>
									<div class="text-xs text-red-600">(-0.45%)</div>
								</td>
							</tr>

							<!-- Example 2: +100% -->
							<tr class="border-b border-slate-200 transition-colors hover:bg-purple-50">
								<td class="px-4 py-4">
									<div class="font-semibold text-slate-900">Example 2</div>
									<div class="mt-1 text-xs text-slate-600">ETH price doubles</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-green-700">+100%</div>
									<div class="text-xs text-slate-600">$2,000 → $4,000</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-mono text-xs">0.7071 ETH</div>
									<div class="font-mono text-xs">2,828 USDC</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-indigo-700">$4,000</div>
									<div class="font-mono text-xs text-slate-600">2,828 / 0.7071</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-blue-700">$5,656</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-mono text-xs">1 ETH</div>
									<div class="font-mono text-xs">2,000 USDC</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-green-700">$6,000</div>
								</td>
								<td class="bg-red-50 px-4 py-4">
									<div class="font-bold text-red-700">-$344</div>
									<div class="text-xs text-red-600">(-5.7%)</div>
								</td>
							</tr>

							<!-- Example 3: -20% -->
							<tr class="border-b border-slate-200 transition-colors hover:bg-pink-50">
								<td class="px-4 py-4">
									<div class="font-semibold text-slate-900">Example 3</div>
									<div class="mt-1 text-xs text-slate-600">ETH price decreases</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-red-700">-20%</div>
									<div class="text-xs text-slate-600">$2,000 → $1,600</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-mono text-xs">1.1180 ETH</div>
									<div class="font-mono text-xs">1,789 USDC</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-indigo-700">$1,600</div>
									<div class="font-mono text-xs text-slate-600">1,789 / 1.1180</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-blue-700">$3,578</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-mono text-xs">1 ETH</div>
									<div class="font-mono text-xs">2,000 USDC</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-orange-700">$3,600</div>
								</td>
								<td class="bg-red-50 px-4 py-4">
									<div class="font-bold text-red-700">-$22</div>
									<div class="text-xs text-red-600">(-0.61%)</div>
								</td>
							</tr>

							<!-- Example 4: -50% -->
							<tr class="transition-colors hover:bg-indigo-50">
								<td class="px-4 py-4">
									<div class="font-semibold text-slate-900">Example 4</div>
									<div class="mt-1 text-xs text-slate-600">ETH price halves</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-red-700">-50%</div>
									<div class="text-xs text-slate-600">$2,000 → $1,000</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-mono text-xs">1.4142 ETH</div>
									<div class="font-mono text-xs">1,414 USDC</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-indigo-700">$1,000</div>
									<div class="font-mono text-xs text-slate-600">1,414 / 1.4142</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-blue-700">$2,828</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-mono text-xs">1 ETH</div>
									<div class="font-mono text-xs">2,000 USDC</div>
								</td>
								<td class="px-4 py-4">
									<div class="font-semibold text-orange-700">$3,000</div>
								</td>
								<td class="bg-red-50 px-4 py-4">
									<div class="font-bold text-red-700">-$172</div>
									<div class="text-xs text-red-600">(-5.7%)</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="mt-6 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-5">
					<p class="mb-3 text-base font-bold text-yellow-900">📊 Key Observations:</p>
					<ul class="space-y-2 text-sm text-yellow-900">
						<li><strong>Small price changes (±20%):</strong> IL is relatively small (~0.5-0.6%)</li>
						<li>
							<strong>Large price changes (±50% or more):</strong> IL becomes significant (~5.7%+)
						</li>
						<li>
							<strong>Always underperforms holding:</strong> You always earn less than simply holding,
							regardless of price direction
						</li>
						<li>
							<strong>Can still be profitable:</strong> Even with IL, your pool value can increase when
							prices rise—you just earn less than you would have by holding
						</li>
					</ul>
				</div>
			</section>

			<!-- Calculating Impermanent Loss -->
			<section class="article-section">
				<h2 class="article-section-title">The Mathematics of Impermanent Loss</h2>

				<p class="article-text">
					Now let's derive the exact mathematical formula that determines impermanent loss for any
					given price change. This derivation will give you a precise tool to calculate your risk
					before providing liquidity.
				</p>

				<div class="article-subsection">
					<h3 class="article-subsection-title">The Constant Product Formula</h3>
					<p class="article-text">
						At the heart of AMMs like Uniswap lies the constant product formula. This invariant
						ensures that the product of the two token reserves remains constant before and after any
						trade (excluding fees):
					</p>

					<div
						class="my-4 rounded-lg border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 p-6"
					>
						<p class="mb-3 text-slate-800">Suppose we have a pool with two tokens, X and Y.</p>
						<p class="mb-3 text-slate-800">
							At time 0, we provide <span class="math-inline">x_0</span> of token X and
							<span class="math-inline">y_0</span>
							of token Y to the pool. The pool price is
							<span class="math-inline" data-latex={'p_0 = \\frac{y_0}{x_0}'}></span>.
						</p>
						<p class="mb-4 text-slate-800">
							At time 1, after some trades, the pool contains <span class="math-inline">x_1</span>
							of token X and <span class="math-inline">y_1</span> of token Y. The pool price is now
							<span class="math-inline" data-latex={'p_1 = \\frac{y_1}{x_1}'}></span>.
						</p>
						<div class="my-4 rounded-lg border-2 border-blue-400 bg-white p-4">
							<div class="text-center">
								<div
									class="math-display text-xl"
									data-latex={'x_0 \\cdot y_0 = x_1 \\cdot y_1 = k'}
								></div>
							</div>
						</div>
						<div class="mt-4 text-sm text-slate-700">
							<p class="mb-2 font-semibold">Where:</p>
							<ul class="ml-4 space-y-1">
								<li>
									• <span class="math-inline">x_0, y_0</span> = initial reserves of tokens X and Y
								</li>
								<li>• <span class="math-inline">x_1, y_1</span> = reserves after trading</li>
								<li>
									• <span class="math-inline">k</span> = constant product (always remains the same)
								</li>
							</ul>
						</div>
					</div>

					<p class="article-text">
						This invariant is the foundation of how AMMs function—no matter how much trading occurs,
						the product
						<span class="math-inline">k</span> remains constant (we ignore fees for simplicity in this
						derivation).
					</p>
				</div>

				<!-- Mathematical Proof -->
				<div class="article-subsection">
					<h3 class="article-subsection-title">Mathematical Proof of Impermanent Loss</h3>

					<p class="article-text">
						Let's prove mathematically why impermanent loss always occurs when prices change, and
						derive the exact formula to calculate it.
					</p>

					<!-- Assumptions -->
					<div class="my-4 rounded-lg border-2 border-slate-300 bg-slate-50 p-5">
						<p class="mb-3 text-base font-bold text-slate-900">Given:</p>
						<ul class="space-y-2 text-sm text-slate-800">
							<li>
								• We have a pool with two tokens <InlinedCode variable="X" color="blue" strong /> and
								<InlinedCode variable="Y" color="blue" strong />
							</li>
							<li>
								• At time <span class="math-inline">t_0</span>, we provide
								<span class="math-inline">x_0</span>
								of token X and <span class="math-inline">y_0</span> of token Y as liquidity
							</li>
							<li>
								• Initial pool price: <span
									class="math-inline"
									data-latex={'p_0 = \\frac{y_0}{x_0}'}
								></span>
							</li>
							<li>
								• At time <span class="math-inline">t_1</span>, after trading, the pool contains
								<span class="math-inline">x_1</span>
								of token X and <span class="math-inline">y_1</span> of token Y
							</li>
							<li>
								• New pool price: <span class="math-inline" data-latex={'p_1 = \\frac{y_1}{x_1}'}
								></span>
							</li>
							<li>
								• Constant product: <span
									class="math-inline"
									data-latex={'x_0 \\cdot y_0 = x_1 \\cdot y_1 = k'}
								></span>
								(where <span class="math-inline">k</span> is the liquidity constant)
							</li>
							<li>
								• The price changes by a factor <span class="math-inline">A</span>:
								<span class="math-inline" data-latex={'p_1 = A \\cdot p_0'}></span>
							</li>
						</ul>
					</div>

					<!-- Step 1: Value if providing liquidity -->
					<div class="my-6">
						<h4 class="mb-3 text-lg font-semibold text-slate-900">
							Step 1: Value with Liquidity Provision
						</h4>
						<p class="article-text mb-3">
							At time <span class="math-inline">t_1</span>, if we provided liquidity, our assets are
							worth:
						</p>
						<div class="rounded-lg border-2 border-blue-300 bg-blue-50 p-5">
							<div
								class="math-display"
								data-latex={'v_1 = y_1 + p_1 \\cdot x_1 = y_1 + \\frac{y_1}{x_1} \\cdot x_1 = 2y_1'}
							></div>
						</div>
					</div>

					<!-- Step 2: Value if just holding -->
					<div class="my-6">
						<h4 class="mb-3 text-lg font-semibold text-slate-900">
							Step 2: Value if Simply Holding
						</h4>
						<p class="article-text mb-3">
							At time <span class="math-inline">t_1</span>, if we had simply held our original
							tokens, they would be worth:
						</p>
						<div class="rounded-lg border-2 border-blue-300 bg-blue-50 p-5">
							<div class="math-display" data-latex={'v = y_0 + p_1 \\cdot x_0'}></div>
						</div>
					</div>

					<!-- Step 3: Derive y_1 in terms of y_0 and A -->
					<div class="my-6">
						<h4 class="mb-3 text-lg font-semibold text-slate-900">
							Step 3: Relating <span class="math-inline">y_1</span> to
							<span class="math-inline">y_0</span>
							and <span class="math-inline">A</span>
						</h4>
						<p class="article-text mb-3">
							Using the constant product formula and price relationships, we can derive:
						</p>
						<div class="space-y-3 rounded-lg border-2 border-blue-300 bg-blue-50 p-5">
							<div>
								<p class="mb-2 text-sm text-slate-700">From the price formulas:</p>
								<div
									class="math-display"
									data-latex={'p_0 = \\frac{y_0}{x_0} \\Rightarrow x_0 = \\frac{y_0}{p_0}'}
								></div>
								<div
									class="math-display"
									data-latex={'p_1 = \\frac{y_1}{x_1} \\Rightarrow x_1 = \\frac{y_1}{p_1}'}
								></div>
							</div>

							<div>
								<p class="mb-2 text-sm text-slate-700">From the constant product formula:</p>
								<div class="math-display" data-latex={'x_0 \\cdot y_0 = x_1 \\cdot y_1'}></div>
								<div
									class="math-display"
									data-latex={'\\frac{y_0}{p_0} \\cdot y_0 = \\frac{y_1}{p_1} \\cdot y_1'}
								></div>
								<div
									class="math-display"
									data-latex={'\\frac{y_0^2}{p_0} = \\frac{y_1^2}{p_1}'}
								></div>
							</div>

							<div>
								<p class="mb-2 text-sm text-slate-700">
									Since <span class="math-inline" data-latex={'p_1 = A \\cdot p_0'}></span>:
								</p>
								<div
									class="math-display"
									data-latex={'y_1^2 = y_0^2 \\cdot \\frac{p_1}{p_0} = y_0^2 \\cdot A'}
								></div>
								<div class="math-display" data-latex={'y_1 = y_0 \\cdot \\sqrt{A}'}></div>
							</div>
						</div>
					</div>

					<!-- Step 4: Express both values in terms of y_0 and A -->
					<div class="my-6">
						<h4 class="mb-3 text-lg font-semibold text-slate-900">
							Step 4: Compare the Two Values
						</h4>
						<p class="article-text mb-3">
							Now we can express both values in terms of <span class="math-inline">y_0</span> and
							<span class="math-inline">A</span>:
						</p>
						<div class="space-y-4 rounded-lg border-2 border-blue-300 bg-blue-50 p-5">
							<div>
								<p class="mb-2 text-sm font-semibold text-slate-900">
									Value with liquidity provision:
								</p>
								<div
									class="math-display"
									data-latex={'v_1 = 2y_1 = 2y_0\\sqrt{A} = y_0(2\\sqrt{A})'}
								></div>
							</div>

							<div>
								<p class="mb-2 text-sm font-semibold text-slate-900">Value if just holding:</p>
								<div
									class="math-display"
									data-latex={'v = y_0 + p_1 \\cdot x_0 = y_0 + p_1 \\cdot \\frac{y_0}{p_0}'}
								></div>
								<div
									class="math-display"
									data-latex={'v = y_0 + y_0 \\cdot \\frac{p_1}{p_0} = y_0 + y_0 \\cdot A'}
								></div>
								<div class="math-display" data-latex={'v = y_0(1 + A)'}></div>
							</div>
						</div>
					</div>

					<!-- Step 5: Proof that holding is always better -->
					<div class="my-6">
						<h4 class="mb-3 text-lg font-semibold text-slate-900">
							Step 5: Proof that <span class="math-inline" data-latex={'v \\geq v_1'}></span>
						</h4>
						<p class="article-text mb-3">
							Using the Cauchy-Schwarz inequality (or simply expanding the perfect square):
						</p>
						<div class="space-y-3 rounded-lg border-2 border-blue-300 bg-blue-50 p-5">
							<div class="math-display" data-latex={'(\\sqrt{A} - 1)^2 \\geq 0'}></div>
							<div class="math-display" data-latex={'A - 2\\sqrt{A} + 1 \\geq 0'}></div>
							<div class="math-display" data-latex={'A + 1 \\geq 2\\sqrt{A}'}></div>
							<div class="math-display" data-latex={'y_0(1 + A) \\geq y_0(2\\sqrt{A})'}></div>
							<div class="math-display" data-latex={'v \\geq v_1'}></div>
						</div>
						<p class="article-text mt-3">
							Equality holds when <span class="math-inline" data-latex={'A = 1'}></span>, meaning
							the price doesn't change. For any other value of <span class="math-inline">A</span>,
							we have <span class="math-inline" data-latex={'v > v_1'}></span>, meaning holding is
							strictly better than providing liquidity.
						</p>
					</div>

					<!-- Conclusion -->
					<div
						class="my-6 rounded-lg border-2 border-red-400 bg-gradient-to-r from-red-50 to-pink-50 p-6"
					>
						<p class="mb-3 text-base font-bold text-red-900">📊 Proof Complete:</p>
						<p class="mb-3 text-sm text-red-900">
							We've proven that <span class="math-inline font-semibold" data-latex={'v \\geq v_1'}
							></span>
							for all values of <span class="math-inline">A</span>, with equality only when
							<span class="math-inline" data-latex={'A = 1'}></span> (no price change).
						</p>
						<p class="text-sm font-semibold text-red-900">
							This means that providing liquidity will <em>always</em> result in less value than simply
							holding when prices change, regardless of the direction. This is the fundamental nature
							of impermanent loss.
						</p>
					</div>

					<!-- IL Formula -->
					<div class="my-6">
						<h4 class="mb-3 text-lg font-semibold text-slate-900">
							The Final Formula: Calculating Impermanent Loss
						</h4>
						<p class="article-text mb-3">
							Now that we've established <span
								class="math-inline"
								data-latex={'v_1 = y_0(2\\sqrt{A})'}
							></span>
							and <span class="math-inline" data-latex={'v = y_0(1 + A)'}></span>, we can calculate
							precisely how much value we lose due to impermanent loss:
						</p>
						<div class="space-y-4 rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
							<div>
								<p class="mb-2 text-sm font-semibold text-slate-900">
									Impermanent Loss as a percentage:
								</p>
								<div class="math-display" data-latex={'\\text{IL} = \\frac{v_1 - v}{v}'}></div>
							</div>

							<div>
								<p class="mb-2 text-sm text-slate-700">Simplifying:</p>
								<div class="math-display" data-latex={'\\text{IL} = \\frac{v_1}{v} - 1'}></div>
							</div>

							<div>
								<p class="mb-2 text-sm text-slate-700">Substituting our values:</p>
								<div
									class="math-display"
									data-latex={'\\text{IL} = \\frac{y_0(2\\sqrt{A})}{y_0(1 + A)} - 1'}
								></div>
								<div
									class="math-display"
									data-latex={'\\text{IL} = \\frac{2\\sqrt{A}}{1 + A} - 1'}
								></div>
							</div>

							<div class="mt-4 rounded-lg border-2 border-blue-400 bg-white p-4">
								<p class="mb-2 text-center text-sm font-bold text-blue-900">Final Formula:</p>
								<div
									class="math-display text-xl"
									data-latex={'\\text{IL} = \\frac{2\\sqrt{A}}{1 + A} - 1'}
								></div>
							</div>

							<div class="mt-4 border-t border-blue-200 pt-4">
								<p class="mb-2 text-sm text-slate-700">
									<strong>Where:</strong> <span class="math-inline">A</span> is the price ratio
									<span class="math-inline" data-latex={'A = \\frac{p_1}{p_0}'}></span>
								</p>
								<p class="mt-3 text-sm text-slate-700">
									<strong>Example:</strong> If the price doubles (<span
										class="math-inline"
										data-latex={'A = 2'}
									></span>):
								</p>
								<div
									class="math-display"
									data-latex={'\\text{IL} = \\frac{2\\sqrt{2}}{1 + 2} - 1 = \\frac{2.828}{3} - 1 \\approx -0.057 = -5.7\\%'}
								></div>
							</div>
						</div>
					</div>

					<!-- Verifying Formula with Real Examples -->
					<div class="my-8">
						<h4 class="mb-3 text-lg font-semibold text-slate-900">
							Verifying the Formula with Real Examples
						</h4>
						<p class="article-text mb-4">
							Let's verify our formula using the real examples from earlier. We'll calculate the
							impermanent loss for each price change scenario and confirm it matches the values we
							saw in the examples table.
						</p>

						<div class="overflow-x-auto">
							<table class="w-full border-collapse overflow-hidden rounded-lg bg-white shadow-md">
								<thead>
									<tr class="bg-gradient-to-r from-indigo-700 to-purple-600 text-white">
										<th class="px-4 py-3 text-left text-sm font-semibold">Scenario</th>
										<th class="px-4 py-3 text-left text-sm font-semibold">Price Change</th>
										<th class="px-4 py-3 text-left text-sm font-semibold">Factor A</th>
										<th class="px-4 py-3 text-left text-sm font-semibold">Formula Calculation</th>
										<th class="bg-red-800 px-4 py-3 text-left text-sm font-semibold"
											>Impermanent Loss</th
										>
									</tr>
								</thead>
								<tbody class="text-sm">
									<!-- Example 1: +20% -->
									<tr class="border-b border-slate-200 transition-colors hover:bg-green-50">
										<td class="px-4 py-4">
											<div class="font-semibold text-slate-900">Example 1</div>
											<div class="mt-1 text-xs text-slate-600">ETH increases</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-semibold text-green-700">+20%</div>
											<div class="text-xs text-slate-600">$2,000 → $2,400</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-mono font-semibold text-indigo-700">A = 1.2</div>
											<div class="font-mono text-xs text-slate-600">2400/2000</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-mono text-xs text-slate-700">
												<span class="math-inline" data-latex={'\\frac{2\\sqrt{1.2}}{1 + 1.2} - 1'}
												></span>
											</div>
											<div class="mt-1 font-mono text-xs text-slate-600">= 2.191/2.2 - 1</div>
											<div class="font-mono text-xs text-slate-600">≈ 0.9955 - 1</div>
										</td>
										<td class="bg-red-50 px-4 py-4">
											<div class="font-bold text-red-700">-0.45%</div>
											<div class="mt-1 text-xs text-green-600">✓ Matches example</div>
										</td>
									</tr>

									<!-- Example 2: +100% -->
									<tr class="border-b border-slate-200 transition-colors hover:bg-purple-50">
										<td class="px-4 py-4">
											<div class="font-semibold text-slate-900">Example 2</div>
											<div class="mt-1 text-xs text-slate-600">ETH doubles</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-semibold text-green-700">+100%</div>
											<div class="text-xs text-slate-600">$2,000 → $4,000</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-mono font-semibold text-indigo-700">A = 2</div>
											<div class="font-mono text-xs text-slate-600">4000/2000</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-mono text-xs text-slate-700">
												<span class="math-inline" data-latex={'\\frac{2\\sqrt{2}}{1 + 2} - 1'}
												></span>
											</div>
											<div class="mt-1 font-mono text-xs text-slate-600">= 2.828/3 - 1</div>
											<div class="font-mono text-xs text-slate-600">≈ 0.943 - 1</div>
										</td>
										<td class="bg-red-50 px-4 py-4">
											<div class="font-bold text-red-700">-5.7%</div>
											<div class="mt-1 text-xs text-green-600">✓ Matches example</div>
										</td>
									</tr>

									<!-- Example 3: -20% -->
									<tr class="border-b border-slate-200 transition-colors hover:bg-pink-50">
										<td class="px-4 py-4">
											<div class="font-semibold text-slate-900">Example 3</div>
											<div class="mt-1 text-xs text-slate-600">ETH decreases</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-semibold text-red-700">-20%</div>
											<div class="text-xs text-slate-600">$2,000 → $1,600</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-mono font-semibold text-indigo-700">A = 0.8</div>
											<div class="font-mono text-xs text-slate-600">1600/2000</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-mono text-xs text-slate-700">
												<span class="math-inline" data-latex={'\\frac{2\\sqrt{0.8}}{1 + 0.8} - 1'}
												></span>
											</div>
											<div class="mt-1 font-mono text-xs text-slate-600">= 1.789/1.8 - 1</div>
											<div class="font-mono text-xs text-slate-600">≈ 0.9939 - 1</div>
										</td>
										<td class="bg-red-50 px-4 py-4">
											<div class="font-bold text-red-700">-0.61%</div>
											<div class="mt-1 text-xs text-green-600">✓ Matches example</div>
										</td>
									</tr>

									<!-- Example 4: -50% -->
									<tr class="transition-colors hover:bg-indigo-50">
										<td class="px-4 py-4">
											<div class="font-semibold text-slate-900">Example 4</div>
											<div class="mt-1 text-xs text-slate-600">ETH halves</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-semibold text-red-700">-50%</div>
											<div class="text-xs text-slate-600">$2,000 → $1,000</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-mono font-semibold text-indigo-700">A = 0.5</div>
											<div class="font-mono text-xs text-slate-600">1000/2000</div>
										</td>
										<td class="px-4 py-4">
											<div class="font-mono text-xs text-slate-700">
												<span class="math-inline" data-latex={'\\frac{2\\sqrt{0.5}}{1 + 0.5} - 1'}
												></span>
											</div>
											<div class="mt-1 font-mono text-xs text-slate-600">= 1.414/1.5 - 1</div>
											<div class="font-mono text-xs text-slate-600">≈ 0.943 - 1</div>
										</td>
										<td class="bg-red-50 px-4 py-4">
											<div class="font-bold text-red-700">-5.7%</div>
											<div class="mt-1 text-xs text-green-600">✓ Matches example</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>

			<!-- Conclusion -->
			<section class="article-section">
				<h2 class="article-section-title">Conclusion</h2>

				<p class="article-text">
					In this article, we've taken a comprehensive mathematical journey through impermanent
					loss, going beyond surface-level explanations to derive the exact formula that governs how
					much liquidity providers lose when prices change. This mathematical foundation gives you a
					powerful tool to quantify your risk before providing liquidity.
				</p>

				<p class="article-text">
					Understanding the mathematics of impermanent loss transforms it from a mysterious concept
					into a quantifiable risk. While you can't eliminate IL in constant product AMMs, you can
					now:
				</p>

				<ul class="article-list ml-6 list-disc space-y-2">
					<li>Calculate your exact potential loss before providing liquidity</li>
					<li>Determine whether expected trading fees will compensate for IL</li>
					<li>
						Make informed decisions about which pools to enter based on price volatility
						expectations
					</li>
					<li>Set appropriate exit strategies when prices diverge from your entry point</li>
				</ul>

				<p class="article-text">
					Armed with this mathematical understanding, you're now equipped to make rational,
					data-driven decisions about liquidity provision. The formula <span
						class="math-inline"
						data-latex={'\\text{IL} = \\frac{2\\sqrt{A}}{1 + A} - 1'}
					></span>
					is your compass for navigating the tradeoffs between earning fees and losing value to price
					changes.
				</p>
			</section>
		</div>

	</div>
</article>
