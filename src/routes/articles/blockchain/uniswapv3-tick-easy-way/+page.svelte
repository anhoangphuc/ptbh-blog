<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import hljs from 'highlight.js/lib/core';
	import typescript from 'highlight.js/lib/languages/typescript';
	import 'highlight.js/styles/github-dark.css';

	import '$lib/styles/article.css';
	import InlinedCode from '$lib/components/InlinedCode.svelte';

	const { data }: { data: PageData } = $props();

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
				<span>20 min read</span>
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
					<h3 class="feature-item-title">Tick Definition</h3>
					<p class="feature-item-text">
						Understand what ticks are and how they enable efficient liquidity provision.
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Difference Array Technique</h3>
					<p class="feature-item-text">
						Discover the algorithmic foundation that makes Uniswap V3's tick system efficient.
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Liquidity Management</h3>
					<p class="feature-item-text">
						Learn how to manage liquidity in Uniswap V3 through the tick system.
					</p>
				</div>
				<div class="feature-item">
					<h3 class="feature-item-title">Swap Mechanics</h3>
					<p class="feature-item-text">
						See how swaps interact with ticks and how crossing boundaries affects liquidity.
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
						Many people, including myself, felt overwhelmed when first encountering the concept of
						Uniswap V3. Even if you're familiar with Uniswap V2, there are many new concepts and
						features in Uniswap V3 to understand. One of them is <InlinedCode
							variable="ticks"
							color="blue"
							strong
						/>.
					</p>

					<p class="article-text">
						You've probably seen descriptions like this: <a
							href="https://uniswap.org/"
							target="_blank"><InlinedCode variable="Uniswap V3" color="blue" strong /></a
						> revolutionized automated market making (AMM) by introducing concentrated liquidity. Unlike
						Uniswap V2, where liquidity is spread across the entire price curve (0 to ∞), V3 allows liquidity
						providers (LPs) to concentrate their capital within specific price ranges.
					</p>
					<p class="article-text">
						This definition wasn't very clear to me at first. I tried to understand it better by
						reading the Uniswap V3 contract code, but quickly felt overwhelmed. The code related to
						ticks is quite complex. I wanted to find a well-balanced explanation—not too general,
						but not too complex either.
					</p>
					<p class="article-text">
						In this article, I'll explain what ticks are from a conceptual level. I hope this
						article can help people like my past self understand the concept of ticks easily without
						feeling intimidated. For implementation details, I'll cover those in a separate article.
					</p>
				</div>
			</section>

			<section class="article-section">
				<h2 class="article-section-title">One-Dimensional Difference Array Technique</h2>
				<p class="article-text">
					Before diving into how Uniswap V3 uses ticks, let's understand a fundamental algorithmic
					technique that makes it all possible: the <strong>1D Difference Array</strong>. This
					classic optimization technique efficiently handles range updates on arrays.
				</p>

				<p class="article-text">
					<strong>The Problem:</strong> Imagine you have an array of values (all starting at 0), and you
					need to add or subtract values across ranges [L, R) many times. Calculate the value of the array
					after all updates.
				</p>
				<p class="article-text">
					<strong>Naive Solution:</strong> Iterates through every element in each range and updates it,
					resulting in O(n) time complexity per update. With many updates, this becomes very inefficient.
				</p>

				<div class="article-text">
					<strong>Efficient Solution:</strong> Instead of updating every element, the difference
					array technique stores only the <em>changes at boundaries</em>. When adding a value V
					across range [L, R), you simply:
					<ul class="article-list list-disc">
						<li>Mark <strong><code>+V</code></strong> at index L (where the range begins)</li>
						<li>Mark <strong><code>-V</code></strong> at index R (where the range ends)</li>
					</ul>
				</div>
				<p class="article-text">
					To get the actual value at any index, you accumulate all changes from the beginning. This
					reduces each range update from O(n) to O(1).
				</p>

				<div class="example-box example-box-blue">
					<div class="example-box-header">Difference Array in Action</div>
					<div class="example-box-content">
						<p class="mb-2 font-semibold text-slate-900">Operations:</p>
						<ol class="article-list list-decimal">
							<li>Add 100 to range [2, 5)</li>
							<li>Add 75 to range [1, 6)</li>
							<li>Subtract 50 from range [3, 5)</li>
						</ol>

						<p class="mt-4 mb-2 font-semibold text-slate-900">Delta Array (boundary changes):</p>
						<p class="mb-3 text-sm text-slate-600">Only store what changes at each boundary:</p>
						<div class="mb-3 rounded bg-slate-100 p-3 font-mono text-sm">
							<div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 0.25rem;">
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[0]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(243, 232, 255); border: 1px solid rgb(196, 181, 253); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[1]</div>
									<div style="color: rgb(22, 163, 74); font-weight: 600;">+75</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(243, 232, 255); border: 1px solid rgb(196, 181, 253); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[2]</div>
									<div style="color: rgb(22, 163, 74); font-weight: 600;">+100</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(243, 232, 255); border: 1px solid rgb(196, 181, 253); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[3]</div>
									<div style="color: rgb(185, 28, 28); font-weight: 600;">-50</div>
								</div>
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[4]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(243, 232, 255); border: 1px solid rgb(196, 181, 253); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[5]</div>
									<div style="color: rgb(185, 28, 28); font-weight: 600;">-50</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(243, 232, 255); border: 1px solid rgb(196, 181, 253); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[6]</div>
									<div style="color: rgb(185, 28, 28); font-weight: 600;">-75</div>
								</div>
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[7]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[8]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[9]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
							</div>
						</div>
						<p class="mb-1 text-xs text-slate-600">
							Each operation only modifies 2 positions: the start and end boundaries.
						</p>
						<p class="mb-4 text-xs text-slate-600">
							For example, value at index 5 is: -100 + 50 = -50
						</p>

						<p class="mb-2 font-semibold text-slate-900">Final Array (accumulated values):</p>
						<p class="mb-3 text-sm text-slate-600">
							Accumulate deltas from left to right to get actual values:
						</p>
						<div class="rounded border border-green-200 bg-green-50 p-3 font-mono text-sm">
							<div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 0.25rem;">
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[0]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(220, 252, 231); border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[1]</div>
									<div style="color: rgb(22, 101, 52); font-weight: 600;">75</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(220, 252, 231); border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[2]</div>
									<div style="color: rgb(22, 101, 52); font-weight: 600;">175</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(220, 252, 231); border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[3]</div>
									<div style="color: rgb(22, 101, 52); font-weight: 600;">125</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(220, 252, 231); border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[4]</div>
									<div style="color: rgb(22, 101, 52); font-weight: 600;">125</div>
								</div>
								<div
									style="padding: 0.5rem; background: rgb(220, 252, 231); border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[5]</div>
									<div style="color: rgb(22, 101, 52); font-weight: 600;">75</div>
								</div>
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[6]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[7]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[8]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
								<div
									style="padding: 0.5rem; background: white; border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
								>
									<div style="color: rgb(100, 116, 139); font-size: 0.75rem;">[9]</div>
									<div style="color: rgb(148, 163, 184);">0</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="article-section">
				<h2 class="article-section-title">Understanding Ticks the Easy Way</h2>
				<p class="article-text">
					At its core, <InlinedCode variable="ticks" color="blue" strong /> are represented as an array.
					Each element in this array contains information about a specific price point. The most important
					piece of information stored at each tick is <InlinedCode
						variable="liquidityNet"
						color="blue"
						strong
					/>—the change in liquidity at that price point.
				</p>
				<p class="article-text">
					To start, you can think of ticks as an array where each index mapping to a discrete price
					point, and the value at that index tells you how liquidity changes when the price crosses
					that point. It's similar to the difference array technique we discussed earlier.
				</p>

				<!-- Subsection 1: Basic Terminology -->
				<div class="article-subsection">
					<h3 class="article-subsection-title">Basic Terminology</h3>
					<div class="article-text">
						<p>
							An <InlinedCode variable="Uniswap pool" color="blue" strong /> contains two tokens (like
							<InlinedCode variable="ETH/USDC" color="gray" strong /> or <InlinedCode
								variable="ETH/BTC"
								color="gray"
								strong
							/>). Throughout this article, we'll use ETH/USDC as our example, where:
						</p>
						<ul class="article-list list-disc">
							<li>
								<InlinedCode variable="ETH" color="gray" strong /> is token X (the base token)
							</li>
							<li>
								<InlinedCode variable="USDC" color="gray" strong /> is token Y (the quote token)
							</li>
							<li>
								<InlinedCode variable="Price" color="gray" strong /> means how many <InlinedCode
									variable="USDC"
									color="gray"
									strong
								/> per 1 <InlinedCode variable="ETH" color="gray" strong /> (e.g., price = 2000 means
								1 <InlinedCode variable="ETH" color="gray" strong /> = 2000 <InlinedCode
									variable="USDC"
									color="gray"
									strong
								/>)
							</li>
							<li>
								<InlinedCode variable="Price range" color="gray" strong /> [2000, 3000) means a range
								of price of the pool is from 2000 to 3000, excluding 3000
							</li>
						</ul>
					</div>
				</div>

				<!-- Subsection 2: Simplified Model -->
				<div class="article-subsection">
					<h3 class="article-subsection-title">Each Tick Represents a Price Point</h3>
					<p class="article-text">
						In <InlinedCode variable="Uniswap V3" color="blue" strong />, each tick index
						corresponds to a specific price. The relationship between a tick index and its price is
						defined by a mathematical formula. Therefore, some price range can also be represented
						by a tick range, with each tick corresponding to a specific price.
					</p>

					<div class="example-box example-box-purple">
						<div class="example-box-header">Our Simplified Model</div>
						<div class="example-box-content">
							<p class="article-text">
								For this article, we'll use a simple linear formula to make the concepts easier to
								follow:
							</p>

							<div class="mt-4 mb-3 text-center font-mono text-lg font-semibold text-purple-700">
								price = 4 × tick_index
							</div>

							<p class="article-text">
								With this formula, assuming ETH price ranges from $4 to $4,000:
							</p>
							<ul class="article-list list-disc">
								<li>Tick 1 = $4</li>
								<li>Tick 500 = $2,000</li>
								<li>Tick 750 = $3,000</li>
								<li>Tick 1,000 = $4,000</li>
							</ul>
						</div>
					</div>

					<div class="example-box example-box-blue">
						<div class="example-box-header">Real Uniswap V3 Formula</div>
						<div class="example-box-content">
							<p class="article-text">
								In the actual Uniswap V3 implementation, the price-to-tick relationship uses an
								exponential formula:
							</p>

							<div class="my-4 text-center font-mono text-lg font-semibold text-blue-900">
								price = 1.0001<sup>tick</sup>
							</div>

							<p class="article-text">
								This exponential spacing allows the protocol to support an enormous price range
								(from nearly 0 to nearly infinity) with consistent percentage-based tick spacing. We
								use a simplified linear formula in this article to make the core concepts easier to
								understand.
							</p>
						</div>
					</div>
				</div>

				<!-- Subsection 3: Concentrated Liquidity -->
				<div class="article-subsection">
					<h3 class="article-subsection-title">Concentrated Liquidity with a Price Range</h3>

					<p class="article-text">
						<strong>Reminder:</strong> The key innovation in Uniswap V3 is concentrated liquidity. Instead
						of spreading capital across all possible prices, liquidity providers can concentrate it within
						a specific price range where they expect trading to occur.
					</p>

					<div class="article-text">
						<p>When providing liquidity in V3, liquidity providers specify:</p>
						<ul class="article-list list-disc">
							<li><strong>Liquidity amount</strong> - How much capital to provide</li>
							<li>
								<strong>Price range</strong> - The minimum and maximum prices for the position
							</li>
						</ul>
					</div>

					<div class="example-box example-box-purple">
						<div class="example-box-header">Concentrated liquidity in Uniswap V3</div>
						<div class="example-box-content">
							<p class="article-text">
								Liquidity providers choose specific price ranges. Notice how different providers'
								ranges can overlap, creating varying liquidity depths at different price points. The
								prices in these ranges are not arbitrary—they correspond to specific tick indices.
							</p>

							<p class="mb-2 font-semibold text-slate-900">Operations:</p>
							<ul class="article-list list-decimal">
								<li>Adds 1,000 liquidity in range [$2,000, $3,000) → ticks [500, 750)</li>
								<li>Adds 2,000 liquidity in range [$2,500, $3,500) → ticks [625, 875)</li>
								<li>Removes 500 liquidity from range [$2,000, $2,500) → ticks [500, 625)</li>
							</ul>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Resulting Liquidity Array:</p>
							<p class="mb-3 text-sm text-slate-600">
								The liquidity at each tick index (showing key ticks in the array):
							</p>
							<div class="rounded-lg border border-green-200 bg-green-50 p-4">
								<div
									class="font-mono text-sm"
									style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.5rem;"
								>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											499
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											500
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											501
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											624
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											625
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											626
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											749
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											750
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											751
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											874
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											875
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											876
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1000
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
								</div>
								<p class="mt-4 text-sm text-green-800">
									The array shows liquidity at each tick. Ticks with green backgrounds and bold
									borders (500, 625, 750, 875) are boundary ticks where liquidity changes. Notice
									how liquidity remains constant between boundaries: 0 before tick 500, then 500
									from ticks 500-624, then 2,500 from ticks 625-749, then 2,000 from ticks 750-874,
									and back to 0 from tick 875 onwards.
								</p>
							</div>
						</div>
					</div>

					<p class="article-text">
						<strong>Contrast with Uniswap V2:</strong> In V2, there is no concept of price ranges. Every
						liquidity provider's capital is automatically spread across the entire price curve, from 0
						to infinity. This means your liquidity is available at all prices, even extremely unlikely
						ones.
					</p>

					<div class="example-box example-box-purple">
						<div class="example-box-header">Spread liquidity in Uniswap V2</div>
						<div class="example-box-content">
							<p class="article-text">Consider the same operations in Uniswap V2:</p>

							<ul class="article-list list-disc">
								<li>Adds 1000 liquidity (spread across all prices)</li>
								<li>Adds 2000 liquidity (spread across all prices)</li>
								<li>Removes 500 liquidity (spread across all prices)</li>
							</ul>

							<p class="article-text">
								<strong>Result:</strong> Total liquidity = 2,500 (1000 + 2000 - 500) uniformly distributed
								across the entire price range [$4, $4,000).
							</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Resulting Liquidity Array:</p>
							<p class="mb-3 text-sm text-slate-600">
								In V2, liquidity is spread uniformly across all ticks (every tick has the same
								liquidity):
							</p>
							<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<div
									class="font-mono text-sm"
									style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.5rem;"
								>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											499
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											500
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											501
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											624
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											625
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											626
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											749
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											750
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											751
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											874
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											875
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											876
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(219, 234, 254); border: 1px solid rgb(147, 197, 253); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1000
										</div>
										<div style="color: rgb(30, 58, 138); font-weight: 600;">2,500</div>
									</div>
								</div>
								<p class="mt-4 text-sm text-blue-800">
									Unlike V3's concentrated liquidity, V2 spreads the same 2,500 liquidity uniformly
									across every single tick from 0 to 1000. There are no boundaries or
									variations—every price point has identical liquidity depth, resulting in capital
									inefficiency.
								</p>
							</div>
						</div>
					</div>

					<p class="article-text">
						<strong>Why this matters:</strong> By concentrating liquidity where trading actually
						happens, <InlinedCode variable="Uniswap V3" color="blue" strong /> allows liquidity providers
						to offer deeper liquidity with the same amount of capital as <InlinedCode
							variable="Uniswap V2"
							color="blue"
							strong
						/>. This means liquidity providers can earn more fees with less capital. However, if the
						price moves outside the chosen range, the position stops earning fees until the price
						returns to that range.
					</p>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">How Swaps Change Current Liquidity</h3>

					<p class="article-text">
						In the previous section, we somehow saw how liquidity is stored at different ticks. But
						which liquidity value does the pool actually use during a swap? The pool tracks two
						critical state variables:
					</p>

					<ul class="article-list list-disc">
						<li>
							<InlinedCode variable="liquidity" color="blue" strong /> - The current active liquidity
							available for trading
						</li>
						<li>
							<InlinedCode variable="tick" color="blue" strong /> (or price) - The current price point
							of the pool
						</li>
					</ul>

					<p class="article-text">
						When a swap happens, the price moves up or down depending on the swap direction (buying
						or selling). As the price crosses tick boundaries (a tick that is tick start or tick end
						when providing liquidity), the <InlinedCode variable="liquidity" color="blue" strong /> value
						must be updated to reflect the new liquidity depth at the new price level.
					</p>

					<div class="example-box example-box-purple">
						<div class="example-box-header">How Liquidity Changes During a Swap</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Initial State:</p>
							<ul class="article-list list-disc">
								<li>We have the following liquidity distribution</li>
								<li>Current tick: 600 (price = $2,400)</li>
								<li>Current liquidity: 500</li>
							</ul>

							<div class="rounded-lg border border-green-200 bg-green-50 p-4">
								<div
									class="font-mono text-sm"
									style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.5rem;"
								>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											499
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											500
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											501
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											624
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											625
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											626
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											749
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											750
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											751
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: white; border: 1px solid rgb(187, 247, 208); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											874
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											875
										</div>
										<div style="color: rgb(22, 101, 52); font-weight: 600;">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											876
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1000
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
								</div>
								<p class="mt-4 text-sm text-green-800">
									The array shows liquidity at each tick. Ticks with green backgrounds and bold
									borders (500, 625, 750, 875) are boundary ticks where liquidity changes. Notice
									how liquidity remains constant between boundaries: 0 before tick 500, then 500
									from ticks 500-624, then 2,500 from ticks 625-749, then 2,000 from ticks 750-874,
									and back to 0 from tick 875 onwards.
								</p>
							</div>

							<p class="mt-4 mb-2 font-semibold text-slate-900">
								Scenario: Let's trace how liquidity changes during swap
							</p>
							<ol class="article-list list-decimal">
								<li>
									Swap USDC for ETH. Price increases from tick 600 → 624
									<ul class="article-list ml-6 list-disc">
										<li>No boundary crossed</li>
										<li>Liquidity remains: 500</li>
									</ul>
								</li>
								<li>
									Swap USDC for ETH. Price increases from tick 624 → 700
									<ul class="article-list ml-6 list-disc">
										<li>Crossed boundary at tick 625</li>
										<li>New liquidity: 2500</li>
									</ul>
								</li>
								<li>
									Swap ETH for USDC. Price decreases from tick 700 → 600
									<ul class="article-list ml-6 list-disc">
										<li>Crossed boundary at tick 625</li>
										<li>New liquidity: 500</li>
									</ul>
								</li>
								<li>
									Swap ETH for USDC. Price decreases from tick 600 → 500
									<ul class="article-list ml-6 list-disc">
										<li>No boundary crossed</li>
										<li>Liquidity remains: 500</li>
									</ul>
								</li>
								<li>
									Swap ETH for USDC. Price decreases from tick 500 → 499
									<ul class="article-list ml-6 list-disc">
										<li>Crossed boundary at tick 500</li>
										<li>New liquidity: 0, swap failed</li>
									</ul>
								</li>
							</ol>
						</div>
					</div>
				</div>
			</section>

			<section class="article-section">
				<h2 class="article-section-title">Tick Management in Action</h2>

				<p class="article-text">
					Now that we understand how ticks work conceptually, let's walk through a realistic
					sequence of operations in an <InlinedCode variable="ETH/USDC" color="gray" strong /> pool. We'll
					examine exactly how adding liquidity, removing liquidity, and swapping affect the pool's current
					tick and current liquidity. For clarity, we'll continue using our simplified model where
					<strong>price = 4 × tick</strong>.
				</p>

				<div class="example-box example-box-indigo">
					<div class="example-box-header">Initial Pool State</div>
					<div class="example-box-content">
						<p class="article-text">
							Let's start with an empty ETH/USDC pool and build it up step by step:
						</p>
						<ul class="article-list list-disc">
							<li>Current tick: 500 (price = $2,000)</li>
							<li>No liquidity positions exist yet</li>
							<li>Current liquidity: 0 (pool is empty)</li>
						</ul>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Operation 1: Add Liquidity</h3>

					<div class="example-box example-box-purple">
						<div class="example-box-header">Add Liquidity Operation</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Action:</p>
							<p class="article-text">
								Adds 1,000 liquidity in range [$2,000, $3,000) → ticks [500, 750)
							</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">What happens:</p>
							<ol class="article-list list-decimal">
								<li>Update tick 500: liquidityNet += 1,000</li>
								<li>Update tick 750: liquidityNet -= 1,000</li>
								<li>Since current tick (500) is within range, update current liquidity</li>
							</ol>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Pool state after:</p>
							<ul class="article-list list-disc">
								<li>Current tick: 500 (unchanged - adding liquidity doesn't move price)</li>
								<li>Current liquidity: 0 + 1,000 = 1,000</li>
							</ul>

							<p class="mt-4 mb-2 font-semibold text-slate-900">
								liquidityNet Array (shows deltas at boundaries):
							</p>
							<div class="mt-2 rounded-lg border border-purple-200 bg-purple-50 p-4">
								<div
									class="font-mono text-sm"
									style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.5rem;"
								>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											500
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+1,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											750
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-1,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1000
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
								</div>
								<p class="mt-3 text-sm text-purple-800">
									Only boundaries have non-zero values: tick 500 gets +1,000 (range start) and tick
									750 gets -1,000 (range end).
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Operation 2: Swap USDC for ETH</h3>

					<div class="example-box example-box-green">
						<div class="example-box-header">Swap Operation (Price Increases)</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Action:</p>
							<p class="article-text">Swap USDC for ETH, pushing price from $2,000 to $2,600</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">What happens:</p>
							<ol class="article-list list-decimal">
								<li>Price moves from tick 500 → tick 650</li>
								<li>No tick boundaries crossed (still within [500, 750))</li>
								<li>Current liquidity stays the same</li>
							</ol>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Pool state after:</p>
							<ul class="article-list list-disc">
								<li>Current tick: 500 → <strong>650</strong> (price moved)</li>
								<li>Current liquidity: 1,000 (unchanged - no boundary crossed)</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Operation 3: Add More Liquidity</h3>

					<div class="example-box example-box-purple">
						<div class="example-box-header">Add Liquidity Operation</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Action:</p>
							<p class="article-text">
								Add 2,000 liquidity in range [$2,500, $3,500) → ticks [625, 875)
							</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">What happens:</p>
							<ol class="article-list list-decimal">
								<li>Update tick 625: liquidityNet += 2,000</li>
								<li>Update tick 875: liquidityNet -= 2,000</li>
								<li>
									Current tick (650) is within the new range [625, 875), so update current liquidity
								</li>
							</ol>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Pool state after:</p>
							<ul class="article-list list-disc">
								<li>Current tick: 650 (unchanged)</li>
								<li>Current liquidity: 1,000 + 2,000 = <strong>3,000</strong></li>
							</ul>

							<p class="mt-4 mb-2 font-semibold text-slate-900">
								liquidityNet Array (shows deltas at boundaries):
							</p>
							<div class="mt-2 rounded-lg border border-purple-200 bg-purple-50 p-4">
								<div
									class="font-mono text-sm"
									style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.5rem;"
								>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											500
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+1,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											625
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											750
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-1,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											875
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
								</div>
								<p class="mt-3 text-sm text-purple-800">
									First position: +1,000 at tick 500, -1,000 at tick 750. Second position: +2,000 at
									tick 625, -2,000 at tick 875. All non-boundary ticks remain 0.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">
						Operation 4: Swap ETH for USDC (Crosses Boundary)
					</h3>

					<div class="example-box example-box-green">
						<div class="example-box-header">Swap Operation (Price Decreases, Crosses Tick)</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Action:</p>
							<p class="article-text">
								Swap ETH for USDC, pushing price from $2,600 down to $2,400
							</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">What happens:</p>
							<ol class="article-list list-decimal">
								<li>Price moves from tick 650 → tick 600</li>
								<li><strong>Crosses tick boundary 625</strong> (going left/down)</li>
								<li>When crossing tick 625 going left, apply liquidityNet[625] = +2,000</li>
								<li>Current liquidity: 3,000 - 2,000 = 1,000</li>
							</ol>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Pool state after:</p>
							<ul class="article-list list-disc">
								<li>Current tick: 650 → <strong>600</strong> (price decreased)</li>
								<li>Current liquidity: 3,000 → <strong>1,000</strong> (crossed boundary at 625)</li>
							</ul>

							<p class="mt-3 text-sm text-green-800">
								<strong>Key insight:</strong> When price crosses a boundary moving left (price decreasing),
								we subtract the liquidityNet value because we're leaving that range.
							</p>
						</div>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Operation 5: Add Liquidity Out of Range</h3>

					<div class="example-box example-box-purple">
						<div class="example-box-header">Add Liquidity (Out of Range)</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Action:</p>
							<p class="article-text">
								Add 1,500 liquidity in range [$3,600, $4,000) → ticks [900, 1000)
							</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">What happens:</p>
							<ol class="article-list list-decimal">
								<li>Update tick 900: liquidityNet += 1,500</li>
								<li>Update tick 1000: liquidityNet -= 1,500</li>
								<li>
									Current tick (600) is <strong>outside</strong> this range, so current liquidity stays
									unchanged
								</li>
							</ol>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Pool state after:</p>
							<ul class="article-list list-disc">
								<li>Current tick: 600 (unchanged)</li>
								<li>Current liquidity: 1,000 (unchanged - position is out of range)</li>
							</ul>

							<p class="mt-3 text-sm text-purple-800">
								<strong>Key insight:</strong> Adding liquidity outside the current price range doesn't
								affect current liquidity. This liquidity will only become active when the price moves
								into that range.
							</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">
								liquidityNet Array (shows deltas at boundaries):
							</p>
							<div class="mt-2 rounded-lg border border-purple-200 bg-purple-50 p-4">
								<div
									class="font-mono text-sm"
									style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.5rem;"
								>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											500
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+1,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											625
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											750
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-1,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											875
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											900
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+1,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1000
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-1,500</div>
									</div>
								</div>
								<p class="mt-3 text-sm text-purple-800">
									Now we have three positions: +1,000 at tick 500/-1,000 at tick 750, +2,000 at tick
									625/-2,000 at tick 875, and +1,500 at tick 900/-1,500 at tick 1000. The new
									position at [900, 1000) doesn't affect current liquidity since current tick is
									600.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">Operation 6: Remove Partial Liquidity</h3>

					<div class="example-box example-box-purple">
						<div class="example-box-header">Remove Liquidity (Partial)</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Action:</p>
							<p class="article-text">
								Remove 400 liquidity from range [$2,000, $3,000) → ticks [500, 750)
							</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">What happens:</p>
							<ol class="article-list list-decimal">
								<li>Update tick 500: liquidityNet -= 400 (from +1,000 to +600)</li>
								<li>Update tick 750: liquidityNet += 400 (from -1,000 to -600)</li>
								<li>Current tick (600) is within this range, so update current liquidity</li>
							</ol>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Pool state after:</p>
							<ul class="article-list list-disc">
								<li>Current tick: 600 (unchanged)</li>
								<li>Current liquidity: 1,000 - 400 = <strong>600</strong></li>
							</ul>

							<p class="mt-4 mb-2 font-semibold text-slate-900">
								Final liquidityNet Array (shows deltas at boundaries):
							</p>
							<div class="mt-2 rounded-lg border border-purple-200 bg-purple-50 p-4">
								<div
									class="font-mono text-sm"
									style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.5rem;"
								>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											500
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+600</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											625
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											750
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-600</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											875
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-2,000</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											900
										</div>
										<div style="color: rgb(22, 163, 74); font-weight: 600;">+1,500</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(248, 250, 252); border: 1px solid rgb(226, 232, 240); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											...
										</div>
										<div style="color: rgb(148, 163, 184);">0</div>
									</div>
									<div
										style="padding: 0.5rem; background: rgb(220, 252, 231); border: 2px solid rgb(22, 163, 74); border-radius: 0.25rem; text-align: center;"
									>
										<div
											style="color: rgb(100, 116, 139); font-size: 0.75rem; margin-bottom: 0.25rem;"
										>
											1000
										</div>
										<div style="color: rgb(220, 38, 38); font-weight: 600;">-1,500</div>
									</div>
								</div>
								<p class="mt-3 text-sm text-purple-800">
									After partial removal, the first position has reduced deltas: +600 at tick 500 and
									-600 at tick 750. The other positions remain unchanged. At current tick 600, the
									active liquidity is 600 from the partially removed position.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="article-subsection">
					<h3 class="article-subsection-title">
						Operation 7: Swap Crossing Boundary (Price Increase)
					</h3>

					<div class="example-box example-box-green">
						<div class="example-box-header">Swap Operation (Price Increases, Crosses Tick)</div>
						<div class="example-box-content">
							<p class="mb-2 font-semibold text-slate-900">Action:</p>
							<p class="article-text">Swap USDC for ETH, pushing price from $2,400 to $2,800</p>

							<p class="mt-4 mb-2 font-semibold text-slate-900">What happens:</p>
							<ol class="article-list list-decimal">
								<li>Price moves from tick 600 → tick 700</li>
								<li><strong>Crosses tick boundary 625</strong> (going right/up)</li>
								<li>When crossing tick 625 going right, apply liquidityNet[625] = +2,000</li>
								<li>Current liquidity: 600 + 2,000 = 2,600</li>
							</ol>

							<p class="mt-4 mb-2 font-semibold text-slate-900">Pool state after:</p>
							<ul class="article-list list-disc">
								<li>Current tick: 600 → <strong>700</strong> (price increased)</li>
								<li>Current liquidity: 600 → <strong>2,600</strong> (crossed boundary at 625)</li>
							</ul>

							<p class="mt-3 text-sm text-green-800">
								<strong>Key insight:</strong> When price crosses a boundary moving right (price increasing),
								we add the liquidityNet value because we're entering that range. Now at tick 700, both
								the first position [500, 750) and second position [625, 875) are active, providing combined
								liquidity of 600 + 2,000 = 2,600.
							</p>
						</div>
					</div>
				</div>

				<div class="my-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
					<p class="mb-2 font-semibold text-indigo-900">Summary of Operations</p>
					<ul class="article-list list-disc text-indigo-800">
						<li>
							<strong>Adding liquidity:</strong> Updates liquidityNet at boundaries, increases current
							liquidity if position includes current tick
						</li>
						<li>
							<strong>Removing liquidity:</strong> Updates liquidityNet at boundaries, decreases current
							liquidity if position includes current tick
						</li>
						<li>
							<strong>Swapping:</strong> Moves current tick (price), updates current liquidity only when
							crossing tick boundaries
						</li>
					</ul>

					<p class="mt-4 mb-2 font-semibold text-indigo-900">Important Notes:</p>
					<ul class="article-list list-disc text-indigo-800">
						<li>
							<strong>Add/Remove operations are immediate:</strong> When adding or removing liquidity,
							the liquidityNet updates at boundaries take effect immediately, and current liquidity is
							updated if the current tick falls within the position's range.
						</li>
						<li>
							<strong>Swap optimization in practice:</strong> In the examples above, we showed swaps
							crossing boundaries tick by tick for educational clarity. However, in the actual
							Uniswap V3 implementation, the swap algorithm is optimized—it doesn't iterate through
							every tick. Instead, it finds the next <em>initialized tick</em> (a tick with non-zero liquidityNet),
							performs the swap calculation between those initialized ticks, then updates the current
							liquidity only when crossing an initialized boundary. This makes swaps extremely gas-efficient
							even with thousands of potential ticks.
						</li>
					</ul>
				</div>
			</section>

			<!-- Conclusion -->
			<section class="article-section">
				<h2 class="article-section-title">Conclusion</h2>
				<p class="article-text">
					In this article, we explored Uniswap V3's tick system from a conceptual perspective,
					breaking down what seemed like a complex topic into understandable pieces. By using a
					simplified model (price = 4 × tick) and relating the tick system to the familiar
					difference array technique, we've seen how Uniswap V3 achieves efficient liquidity
					management.
				</p>
				<p class="article-text">The key concepts we covered:</p>
				<ul class="article-list list-disc">
					<li>
						The difference array technique as the algorithmic foundation for efficient range updates
					</li>
					<li>Ticks as discrete price points where liquidity changes occur</li>
					<li>
						How concentrated liquidity allows capital to be focused within specific price ranges
					</li>
					<li>
						How swaps interact with ticks and update current liquidity when crossing boundaries
					</li>
					<li>The mechanics of adding, removing liquidity and how it affects the tick system</li>
				</ul>
				<p class="article-text">
					Understanding these fundamentals provides a solid foundation for working with Uniswap V3.
					However, this conceptual overview is just the beginning. In a follow-up article, we'll
					dive into the implementation details—exploring the actual mathematical formulas for
					tick-to-price conversion, the data structures used in the smart contracts, gas
					optimization techniques, and how to interact with the protocol programmatically.
				</p>
				<p class="article-text">
					For now, I hope this gentle introduction has demystified the tick system and made Uniswap
					V3 more approachable. The conceptual understanding you've gained here will serve as a
					strong foundation when you're ready to explore the technical implementation.
				</p>
			</section>
		</div>

	</div>
</article>
