<script lang="ts">
	import { onMount } from 'svelte';
	import hljs from 'highlight.js/lib/core';
	import rust from 'highlight.js/lib/languages/rust';
	import 'highlight.js/styles/github-dark.css';
	import type { PageProps } from './$types';

    const { data }: PageProps = $props();

    const { rustCode } = data;

	hljs.registerLanguage('rust', rust);

	onMount(() => {
		hljs.highlightAll();
	});
</script>

<svelte:head>
	<title>Understanding Pump.fun and Raydium Integration | PTBH Blog</title>
	<meta
		name="description"
		content="A deep dive into Pump.fun's token launch mechanism and its integration with Raydium DEX on Solana"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<article class="mx-auto min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-16">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<header class="mb-12">
			<div class="mb-4 flex items-center gap-3 text-sm text-slate-600">
				<span class="rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700"
					>Blockchain</span
				>
				<span>•</span>
				<time datetime="2026-01-01">January 1, 2026</time>
				<span>•</span>
				<span>5 min read</span>
			</div>
			<h1
				class="mb-6 font-serif text-5xl font-bold leading-tight text-slate-900 md:text-6xl"
				style="font-family: 'Playfair Display', serif;"
			>
				Understanding Pump.fun and Raydium Integration
			</h1>
			<p class="text-xl leading-relaxed text-slate-700" style="font-family: 'Inter', sans-serif;">
				Exploring Solana's premier token launch platform and its seamless integration with Raydium
				DEX for instant liquidity provision.
			</p>
		</header>

		<!-- Content -->
		<div class="prose prose-lg max-w-none" style="font-family: 'Inter', sans-serif;">
			<!-- Introduction Section -->
			<section class="mb-12">
				<h2
					class="mb-4 font-serif text-3xl font-bold text-slate-900"
					style="font-family: 'Playfair Display', serif;"
				>
					What is Pump.fun?
				</h2>
				<p class="mb-4 leading-relaxed text-slate-700">
					<strong>Pump.fun</strong> is a revolutionary token launch platform on Solana that democratizes
					token creation and fair launches. Unlike traditional token launches that require significant
					technical knowledge and upfront liquidity, Pump.fun provides a streamlined bonding curve mechanism
					that enables anyone to launch a token in seconds.
				</p>
				<p class="mb-4 leading-relaxed text-slate-700">
					The platform operates on a unique bonding curve model where token prices automatically
					increase as more buyers participate. Once a token reaches a market cap threshold (typically
					$69,000), it automatically graduates to Raydium, Solana's leading automated market maker
					(AMM), with instant liquidity provision.
				</p>
			</section>

			<!-- Key Features -->
			<section class="mb-12 rounded-xl bg-white p-8 shadow-sm">
				<h2
					class="mb-6 font-serif text-3xl font-bold text-slate-900"
					style="font-family: 'Playfair Display', serif;"
				>
					Key Features
				</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="rounded-lg border border-slate-200 p-6">
						<h3 class="mb-2 text-xl font-semibold text-slate-900">Fair Launch Mechanism</h3>
						<p class="text-slate-600">
							No pre-sales, no team allocations. Everyone buys from the same bonding curve, ensuring
							fair price discovery.
						</p>
					</div>
					<div class="rounded-lg border border-slate-200 p-6">
						<h3 class="mb-2 text-xl font-semibold text-slate-900">Instant Liquidity</h3>
						<p class="text-slate-600">
							Automatic graduation to Raydium with burned LP tokens creates permanent liquidity
							pools.
						</p>
					</div>
					<div class="rounded-lg border border-slate-200 p-6">
						<h3 class="mb-2 text-xl font-semibold text-slate-900">Low Entry Barrier</h3>
						<p class="text-slate-600">
							Launch a token with minimal cost and zero coding required through an intuitive
							interface.
						</p>
					</div>
					<div class="rounded-lg border border-slate-200 p-6">
						<h3 class="mb-2 text-xl font-semibold text-slate-900">Built on Solana</h3>
						<p class="text-slate-600">
							Leverages Solana's high throughput and low fees for seamless trading experiences.
						</p>
					</div>
				</div>
			</section>

			<!-- Code Example -->
			<section class="mb-12">
				<h2
					class="mb-4 font-serif text-3xl font-bold text-slate-900"
					style="font-family: 'Playfair Display', serif;"
				>
					Interacting with Pump.fun: Rust Example
				</h2>
				<p class="mb-6 leading-relaxed text-slate-700">
					Here's a simplified example of how you might interact with Pump.fun's bonding curve
					program using Rust and the Anchor framework. This demonstrates buying tokens from the
					bonding curve:
				</p>

				<div class="overflow-hidden rounded-xl bg-slate-900 shadow-lg">
					<div class="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-6 py-3">
						<span class="font-mono text-sm text-slate-300">bonding_curve.rs</span>
						<span class="text-xs text-slate-400">Rust</span>
					</div>
					<pre class="overflow-x-auto p-6"><code class="rust" style="font-family: 'JetBrains Mono', monospace;">{rustCode}</code></pre>
				</div>

				<div class="mt-4 rounded-lg bg-blue-50 p-4">
					<p class="text-sm leading-relaxed text-blue-900">
						<strong>Note:</strong> This is a simplified educational example. The actual Pump.fun program
						includes additional security checks, fee calculations, and more sophisticated curve mathematics.
					</p>
				</div>
			</section>

			<!-- Integration with Raydium -->
			<section class="mb-12">
				<h2
					class="mb-4 font-serif text-3xl font-bold text-slate-900"
					style="font-family: 'Playfair Display', serif;"
				>
					The Raydium Migration
				</h2>
				<p class="mb-4 leading-relaxed text-slate-700">
					When a token on Pump.fun reaches the graduation threshold, an automated process migrates
					it to Raydium. This involves:
				</p>
				<ol class="mb-4 list-decimal space-y-2 pl-6 text-slate-700">
					<li>Creating a new liquidity pool on Raydium with the accumulated SOL reserves</li>
					<li>Transferring all remaining tokens to the pool</li>
					<li>Burning the LP tokens to ensure permanent liquidity</li>
					<li>Disabling further purchases from the bonding curve</li>
				</ol>
				<p class="leading-relaxed text-slate-700">
					This seamless transition ensures that successful tokens gain deep liquidity and trading
					infrastructure without manual intervention from creators.
				</p>
			</section>

			<!-- Conclusion -->
			<section class="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-8">
				<h2
					class="mb-4 font-serif text-3xl font-bold text-slate-900"
					style="font-family: 'Playfair Display', serif;"
				>
					Conclusion
				</h2>
				<p class="mb-4 leading-relaxed text-slate-700">
					Pump.fun represents a significant innovation in token launches, combining fairness,
					accessibility, and automation. By integrating with Raydium, it creates a complete
					lifecycle from initial token creation to mature DEX trading.
				</p>
				<p class="leading-relaxed text-slate-700">
					For developers and traders alike, understanding these mechanisms is crucial for
					navigating the Solana DeFi ecosystem and building the next generation of tokenized
					projects.
				</p>
			</section>
		</div>

		<!-- Footer -->
		<footer class="mt-16 border-t border-slate-200 pt-8">
			<div class="flex items-center justify-between">
				<a
					href="/"
					class="text-slate-600 transition-colors hover:text-slate-900"
					style="font-family: 'Inter', sans-serif;"
				>
					← Back to Home
				</a>
				<div class="flex gap-4">
					<span class="text-sm text-slate-500">Share:</span>
					<button class="text-slate-600 transition-colors hover:text-blue-600">Twitter</button>
					<button class="text-slate-600 transition-colors hover:text-blue-600">LinkedIn</button>
				</div>
			</div>
		</footer>
	</div>
</article>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
	}
</style>
