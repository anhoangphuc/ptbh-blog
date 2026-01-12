<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import hljs from 'highlight.js/lib/core';
	import typescript from 'highlight.js/lib/languages/typescript';
	import 'highlight.js/styles/github-dark.css';

	import '$lib/styles/article.css';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import InlinedCode from '$lib/components/InlinedCode.svelte';

	const { data }: { data: PageData } = $props();
	const tickSpacingExample = $derived(data.tickSpacingExample);
	const tickMathExample = $derived(data.tickMathExample);
	const rangeExample = $derived(data.rangeExample);
	const concentratedLiquidityCode = $derived(data.concentratedLiquidityCode);

	hljs.registerLanguage('typescript', typescript);

	onMount(() => {
		hljs.highlightAll();
	});
</script>

<svelte:head>
	<title>Understanding Uniswap V3 Ticks - The Easy Way</title>
	<meta
		name="description"
		content="A simple introduction to understanding Uniswap V3 ticks, tick spacing, and concentrated liquidity"
	/>
</svelte:head>

<article class="article-container">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<header class="article-header">
			<div class="article-meta">
				<span class="article-category">Blockchain</span>
				<span>•</span>
				<time datetime="2026-01-04">January 4, 2026</time>
				<span>•</span>
				<span>10 min read</span>
			</div>
			<h1 class="article-title">Understanding Uniswap V3 Ticks - The Easy Way</h1>
			<p class="article-subtitle">
				A gentle introduction to Uniswap V3's tick system, explaining how concentrated liquidity
				enables capital-efficient market making through discrete price points.
			</p>
		</header>

		<!-- Key Features -->
		<section class="feature-grid">
			<h2 class="article-section-title">What you will learn</h2>
			<div class="feature-grid-items">
				<div class="feature-item">
					<h3 class="feature-item-title">Tick Spacing Basics</h3>
					<p class="feature-item-text">
						Understand what ticks are, how tick spacing works across different fee tiers,
						and why they're fundamental to Uniswap V3.
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Price Calculations</h3>
					<p class="feature-item-text">
						Learn how to convert between tick values and prices using simple mathematical formulas.
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Liquidity Ranges</h3>
					<p class="feature-item-text">
						Discover how to provide liquidity in specific price ranges and understand
						the benefits of concentrated liquidity.
					</p>
				</div>
			</div>
		</section>

		<!-- Content -->
		<div class="article-content">
			<!-- Introduction Section -->
			<section class="article-section">
				<h2 class="article-section-title">Introduction</h2>
				<div>
					<p class="article-text">
						I think there are many people like me, feeling shock in the first time we encounter the concept of Uniswap V3.
						Even we're very familiar with the Uniswap V2, there are so many new concepts and features in Uniswap V3 we need to understand.
						Of of them is <InlinedCode variable="ticks" color="blue" strong />
						<br />

						<strong><a href="https://uniswap.org/" target="_blank">Uniswap V3</a></strong> revolutionized
						automated market making (AMM) by introducing concentrated liquidity. Unlike Uniswap V2, where
						liquidity is spread across the entire price curve (0 to ∞), V3 allows liquidity providers (LPs)
						to concentrate their capital within specific price ranges.
					</p>
					<p class="article-text">
						At the heart of this innovation lies the concept of <strong>ticks</strong>—discrete price
						points that define where liquidity can be placed. Understanding ticks is essential for anyone
						who wants to provide liquidity efficiently or build on top of Uniswap V3.
					</p>
				</div>
			</section>

			<!-- What Are Ticks -->
			<section class="article-section">
				<h2 class="article-section-title">What Are Ticks?</h2>
				<p class="article-text">
					In Uniswap V3, the continuous price space is divided into discrete units called
					<InlinedCode variable="ticks" color="purple" strong />. Each tick represents a specific price point
					at which liquidity can be added or removed.
				</p>
				<p class="article-text">
					Mathematically, each tick corresponds to a price calculated using the formula:
				</p>
				<div class="info-box">
					<p class="info-box-text">
						<strong>Price Formula:</strong> <code>price = 1.0001^tick</code>
						<br /><br />
						Where <code>tick</code> is an integer value that can be positive, negative, or zero.
						<br />
						• tick = 0 corresponds to a 1:1 price ratio
						<br />
						• Positive ticks represent prices greater than 1
						<br />
						• Negative ticks represent prices less than 1
					</p>
				</div>
				<p class="article-text">
					This exponential relationship means that each tick represents approximately a 0.01% price change
					from the previous tick. This precision allows for fine-grained control over liquidity placement.
				</p>
			</section>

			<!-- Tick Spacing -->
			<section class="article-section">
				<h2 class="article-section-title">Understanding Tick Spacing</h2>
				<p class="article-text">
					Not all ticks are usable in Uniswap V3. To reduce gas costs and prevent pool fragmentation,
					only certain ticks can have liquidity positions. This restriction is called
					<InlinedCode variable="tick spacing" color="blue" strong />.
				</p>
				<p class="article-text">
					Tick spacing varies by fee tier. Uniswap V3 has three main fee tiers, each with its own tick spacing:
				</p>

				<div class="code-container">
					<div class="code-header">
						<span class="code-filename">fee-tiers.ts</span>
						<span class="code-language">TypeScript</span>
					</div>
					<pre class="code-block"><code class="typescript">{tickSpacingExample}</code></pre>
				</div>

				<div class="info-box">
					<p class="info-box-text">
						<strong>Explanation:</strong> Lower fee tiers (0.05%) have tighter tick spacing (every 10 ticks),
						allowing for more precise liquidity placement. Higher fee tiers (1%) have wider spacing (every 200 ticks),
						which is suitable for more volatile pairs. This design balances gas efficiency with capital efficiency.
					</p>
				</div>

				<br />

				<p class="article-text">
					For example, in a 0.3% fee tier pool (tick spacing = 60), you can only add liquidity at ticks
					that are multiples of 60: ..., -120, -60, 0, 60, 120, ...
				</p>
			</section>

			<!-- Tick Math -->
			<section class="article-section">
				<h2 class="article-section-title">Converting Between Ticks and Prices</h2>
				<p class="article-text">
					When providing liquidity or analyzing positions, you'll often need to convert between human-readable
					prices and tick values. Here are the conversion formulas:
				</p>

				<CodeBlock
					code={tickMathExample}
					language="typescript"
					filename="tick-math.ts"
					maxLines={20}
				/>

				<div class="info-box">
					<p class="info-box-text">
						<strong>Explanation:</strong> The <code>tickToPrice</code> function raises 1.0001 to the power
						of the tick to get the price. The <code>priceToTick</code> function does the reverse using logarithms.
						Note that we use <code>Math.floor</code> to ensure the tick is valid and aligns with tick spacing.
						<br /><br />
						At tick 0, the price is exactly 1:1. At tick 10,000, the price is approximately 2.7183
						(about e, Euler's number), meaning the token has increased in value by roughly 171.8%.
					</p>
				</div>
			</section>

			<!-- Liquidity Ranges -->
			<section class="article-section">
				<h2 class="article-section-title">Providing Liquidity in Price Ranges</h2>
				<p class="article-text">
					The power of Uniswap V3 comes from concentrated liquidity. Instead of spreading your capital
					across the entire price curve, you can concentrate it within a specific price range defined
					by two ticks: <InlinedCode variable="tickLower" color="blue" /> and <InlinedCode variable="tickUpper" color="blue" />.
				</p>

				<div class="code-container">
					<div class="code-header">
						<span class="code-filename">liquidity-position.ts</span>
						<span class="code-language">TypeScript</span>
					</div>
					<pre class="code-block"><code class="typescript">{rangeExample}</code></pre>
				</div>

				<div class="info-box">
					<p class="info-box-text">
						<strong>Explanation:</strong> This example shows a liquidity position for an ETH/USDC pair.
						The provider believes ETH will trade between $1,800 and $2,200, so they concentrate their
						liquidity in that range. If the price stays within this range, they'll earn much higher fees
						relative to their capital compared to V2. However, if the price moves outside this range,
						their liquidity becomes inactive and doesn't earn fees.
					</p>
				</div>

				<br />

				<p class="article-text">
					When you provide liquidity in a range:
				</p>
				<ul class="article-list list-disc">
					<li>
						Your liquidity is <strong>active</strong> and earns fees when the current price is between
						<InlinedCode variable="tickLower" color="blue" /> and <InlinedCode variable="tickUpper" color="blue" />
					</li>
					<li>
						Your position is composed entirely of one token if the price is outside your range
					</li>
					<li>
						The narrower your range, the more capital efficient your position, but the higher the risk
						of the price moving outside your range
					</li>
				</ul>
			</section>

			<!-- V2 vs V3 Comparison -->
			<section class="article-section">
				<h2 class="article-section-title">Concentrated Liquidity: V2 vs V3</h2>
				<p class="article-text">
					Let's compare traditional AMM liquidity (Uniswap V2) with concentrated liquidity (Uniswap V3):
				</p>

				<div class="code-container">
					<div class="code-header">
						<span class="code-filename">v2-vs-v3.ts</span>
						<span class="code-language">TypeScript</span>
					</div>
					<pre class="code-block"><code class="typescript">{concentratedLiquidityCode}</code></pre>
				</div>

				<div class="info-box">
					<p class="info-box-text">
						<strong>Key Insight:</strong> Uniswap V3's concentrated liquidity can achieve up to 4000x
						higher capital efficiency compared to V2. This means you can provide the same depth of liquidity
						with far less capital—or earn significantly more fees with the same amount of capital. The
						tradeoff is that you need to actively manage your positions to keep them in range.
					</p>
				</div>

				<br />

				<!-- Comparison Table -->
				<div class="my-8 overflow-hidden rounded-xl bg-white shadow-lg">
					<div class="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4">
						<h3 class="text-xl font-bold text-slate-900" style="font-family: 'Playfair Display', serif;">
							Uniswap V2 vs V3 Comparison
						</h3>
					</div>

					<!-- Table -->
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-slate-50">
								<tr>
									<th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Feature</th>
									<th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Uniswap V2</th>
									<th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Uniswap V3</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-200">
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900">Liquidity Distribution</td>
									<td class="px-6 py-4 text-sm text-slate-600">Spread across entire curve (0 to ∞)</td>
									<td class="px-6 py-4 text-sm text-green-600 font-medium">Concentrated in custom ranges</td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900">Capital Efficiency</td>
									<td class="px-6 py-4 text-sm text-slate-600">Low - most capital unused</td>
									<td class="px-6 py-4 text-sm text-green-600 font-medium">Up to 4000x higher</td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900">Fee Earnings</td>
									<td class="px-6 py-4 text-sm text-slate-600">Diluted across all prices</td>
									<td class="px-6 py-4 text-sm text-green-600 font-medium">Concentrated in active range</td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900">Fee Tiers</td>
									<td class="px-6 py-4 text-sm text-slate-600">Fixed 0.3%</td>
									<td class="px-6 py-4 text-sm text-green-600 font-medium">Multiple tiers (0.05%, 0.3%, 1%)</td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900">Position Management</td>
									<td class="px-6 py-4 text-sm text-green-600 font-medium">Passive - set and forget</td>
									<td class="px-6 py-4 text-sm text-slate-600">Active - requires monitoring</td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900">Impermanent Loss Risk</td>
									<td class="px-6 py-4 text-sm text-slate-600">Present but spread out</td>
									<td class="px-6 py-4 text-sm text-slate-600">Higher if price exits range</td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900">Gas Costs</td>
									<td class="px-6 py-4 text-sm text-green-600 font-medium">Lower (simpler logic)</td>
									<td class="px-6 py-4 text-sm text-slate-600">Higher (more complex)</td>
								</tr>
							</tbody>
						</table>
						<br />
						<div class="info-box">
							<p class="info-box-text">
								This table highlights the key tradeoffs between V2's simplicity and V3's capital efficiency.
								V3 offers significantly better returns for active LPs but requires more sophisticated management.
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Practical Example -->
			<section class="article-section">
				<h2 class="article-section-title">Practical Example: ETH/USDC Pool</h2>
				<p class="article-text">
					Let's walk through a concrete example of providing liquidity to an ETH/USDC pool:
				</p>

				<div class="info-box">
					<p class="info-box-text">
						<strong>Scenario:</strong> You have $10,000 to provide as liquidity. ETH is currently trading at $2,000.
						<br /><br />
						<strong>V2 Approach:</strong>
						<br />
						• Deposit $5,000 in USDC + $5,000 in ETH (2.5 ETH)
						<br />
						• Your liquidity earns 0.3% fees on ALL trades, but it's spread from $0 to infinity
						<br />
						• Capital efficiency: Low (most liquidity is never used)
						<br /><br />
						<strong>V3 Approach (0.3% fee tier):</strong>
						<br />
						• You believe ETH will trade between $1,800 - $2,200 (90% - 110% of current price)
						<br />
						• Set tickLower = -276325 (≈$1,800) and tickUpper = -276110 (≈$2,200)
						<br />
						• Your $10,000 acts like ~$50,000 in a V2 pool within this range
						<br />
						• You earn 5x more fees per dollar—but only when price stays in range
					</p>
				</div>

				<p class="article-text">
					The key insight: With V3, you're making a bet on where the price will trade. The tighter
					your range, the higher your potential returns—but also the higher your risk of going out of range.
				</p>
			</section>

			<!-- Best Practices -->
			<section class="article-section">
				<h2 class="article-section-title">Best Practices for Tick Selection</h2>
				<p class="article-text">
					When choosing ticks for your liquidity position, consider these guidelines:
				</p>
				<ul class="article-list list-disc">
					<li>
						<strong>Respect tick spacing:</strong> Ensure your tickLower and tickUpper are multiples
						of the pool's tick spacing, or your transaction will fail.
					</li>
					<li>
						<strong>Consider volatility:</strong> More volatile pairs need wider ranges. Stablecoin
						pairs (USDC/USDT) can use very tight ranges, while ETH/altcoin pairs need wider ranges.
					</li>
					<li>
						<strong>Monitor your position:</strong> Set up alerts for when the price approaches your
						range boundaries. You may need to rebalance or create new positions.
					</li>
					<li>
						<strong>Factor in gas costs:</strong> Frequent rebalancing on Ethereum mainnet can be
						expensive. Consider Layer 2 solutions like Arbitrum or Optimism for active strategies.
					</li>
					<li>
						<strong>Use fee tier wisely:</strong> Higher fee tiers (1%) compensate for higher volatility
						and impermanent loss risk. Stable pairs should use 0.05% tier.
					</li>
				</ul>
			</section>

			<!-- Conclusion -->
			<section class="highlighted-section">
				<h2 class="article-section-title">Conclusion</h2>
				<p class="article-text">
					Uniswap V3's tick system transforms AMM liquidity provision from a passive to an active strategy.
					By understanding how ticks work, how to calculate prices, and how to choose appropriate ranges,
					you can significantly improve your capital efficiency as a liquidity provider.
				</p>
				<p class="article-text">
					The key concepts to remember:
				</p>
				<ul class="article-list list-disc">
					<li>Ticks are discrete price points where liquidity can be placed</li>
					<li>Each tick represents approximately a 0.01% price change (1.0001^tick)</li>
					<li>Tick spacing varies by fee tier to balance gas costs and precision</li>
					<li>Concentrated liquidity allows up to 4000x capital efficiency compared to V2</li>
					<li>Active management is required to maintain positions in range</li>
				</ul>
				<p class="article-text">
					While V3 offers tremendous advantages, it also requires more sophistication from liquidity providers.
					Start with wider ranges and conservative positions as you learn, then optimize as you gain experience
					with tick management and price prediction.
				</p>
			</section>
		</div>

		<!-- Footer -->
		<footer class="article-footer">
			<div class="article-footer-content">
				<a href="/articles/blockchain" class="article-back-link">← Back to Blockchain Articles</a>
				<div class="article-share">
					<span class="article-share-label">Share:</span>
					<button class="article-share-button">Twitter</button>
					<button class="article-share-button">LinkedIn</button>
				</div>
			</div>
		</footer>
	</div>
</article>
