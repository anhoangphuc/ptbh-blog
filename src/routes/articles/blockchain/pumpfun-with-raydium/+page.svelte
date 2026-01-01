<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import hljs from 'highlight.js/lib/core';
	import rust from 'highlight.js/lib/languages/rust';
	import 'highlight.js/styles/github-dark.css';

	import '$lib/styles/article.css';

	const { data }: { data: PageData } = $props();
	const rustCode = $derived(data.rustCode);

	hljs.registerLanguage('rust', rust);

	onMount(() => {
		hljs.highlightAll();
	});
</script>

<svelte:head>
	<title>How does Pump.fun create a liquidity pool on Raydium ?</title>
	<meta
		name="description"
		content="A coding tour to explain how Pump.fun creates a liquidity pool on Raydium"
	/>
</svelte:head>

<article class="article-container">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<header class="article-header">
			<div class="article-meta">
				<span class="article-category">Blockchain</span>
				<span>•</span>
				<time datetime="2026-01-01">January 1, 2026</time>
				<span>•</span>
				<span>5 min read</span>
			</div>
			<h1 class="article-title">How does Pump.fun create a liquidity pool on Raydium ?</h1>
			<p class="article-subtitle">
                A coding tour to explain how Pump.fun creates a liquidity pool on Raydium in an atomic and automatically way.
                This is a simplified example to explain how and why Pump stores the liquidity, and migrate it to Raydium when possible.
			</p>
		</header>

        <!-- Key Features -->
        <section class="feature-grid">
            <h2 class="article-section-title">What you will learn</h2>
            <div class="feature-grid-items">
                <div class="feature-item">
                    <h3 class="feature-item-title">Solana Account Types</h3>
                    <p class="feature-item-text">
                        Introduce about the basic types of accounts in Solana.
                        In which circumstances you use which type of account.
                    </p>
                </div>
                <div class="feature-item">
                    <h3 class="feature-item-title">Raydium Instructions</h3>
                    <p class="feature-item-text">
                        Learn about how we integrate with Raydium SDK, and use instructions to create a liquidity pool.
                    </p>
                </div>
                <div class="feature-item">
                    <h3 class="feature-item-title">CPI to create a liquidity pool</h3>
                    <p class="feature-item-text">
                        Learn about how we use store assets on program, and invoke CPI to create a liquidity pool on Raydium.
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
						<strong>Pump.fun</strong> - The largest meme coin launchpad in Solana, has a great feature:
						When a token reaches a certain price threshold, it can be paired with SOL to create a Raydium pool.
						The process involves three simple steps:
					</p>
					<ul class="article-list list-disc">
						<li>Create a meme on Pump.fun program</li>
						<li>Swap the meme on Pump.fun program</li>
						<li>Once the meme's price reaches a target value, migrate the SOL and tokens from Pump.fun to
							create a Raydium pool that allows trading on Raydium</li>
					</ul>
				</div>
                <div>
                    <p class="article-text">
                        The success of Pump.fun has inspired many people to create their own forks.
                        Steps 1 and 2 are straightforward since they occur entirely within your forked program.
                        The challenge arises with step 3: migrating your assets to Raydium.
                        There are two main difficulties:
                    </p>
                    <ul class="article-list list-disc">
                        <li>You need to build the correct Raydium instructions</li>
                        <li>You need to understand Solana's account management</li>
                    </ul>
                </div>
				<p class="article-text">
                    We'll walk through this step by step and see how we tackle these challenges.
				</p>

			</section>

			<!-- Code Example -->
			<section class="article-section">
				<h2 class="article-section-title">Interacting with Pump.fun: Rust Example</h2>
				<p class="article-text">
					Here's a simplified example of how you might interact with Pump.fun's bonding curve
					program using Rust and the Anchor framework. This demonstrates buying tokens from the
					bonding curve:
				</p>

				<div class="code-container">
					<div class="code-header">
						<span class="code-filename">bonding_curve.rs</span>
						<span class="code-language">Rust</span>
					</div>
					<pre class="code-block"><code class="rust">{rustCode}</code></pre>
				</div>

				<div class="info-box">
					<p class="info-box-text">
						<strong>Note:</strong> This is a simplified educational example. The actual Pump.fun program
						includes additional security checks, fee calculations, and more sophisticated curve mathematics.
					</p>
				</div>
			</section>

			<!-- Integration with Raydium -->
			<section class="article-section">
				<h2 class="article-section-title">The Raydium Migration</h2>
				<p class="article-text">
					When a token on Pump.fun reaches the graduation threshold, an automated process migrates
					it to Raydium. This involves:
				</p>
				<ol class="article-list decimal">
					<li>Creating a new liquidity pool on Raydium with the accumulated SOL reserves</li>
					<li>Transferring all remaining tokens to the pool</li>
					<li>Burning the LP tokens to ensure permanent liquidity</li>
					<li>Disabling further purchases from the bonding curve</li>
				</ol>
				<p class="article-text">
					This seamless transition ensures that successful tokens gain deep liquidity and trading
					infrastructure without manual intervention from creators.
				</p>
			</section>

			<!-- Conclusion -->
			<section class="highlighted-section">
				<h2 class="article-section-title">Conclusion</h2>
				<p class="article-text">
					Pump.fun represents a significant innovation in token launches, combining fairness,
					accessibility, and automation. By integrating with Raydium, it creates a complete
					lifecycle from initial token creation to mature DEX trading.
				</p>
				<p class="article-text">
					For developers and traders alike, understanding these mechanisms is crucial for
					navigating the Solana DeFi ecosystem and building the next generation of tokenized
					projects.
				</p>
			</section>
		</div>

		<!-- Footer -->
		<footer class="article-footer">
			<div class="article-footer-content">
				<a href="/" class="article-back-link">← Back to Home</a>
				<div class="article-share">
					<span class="article-share-label">Share:</span>
					<button class="article-share-button">Twitter</button>
					<button class="article-share-button">LinkedIn</button>
				</div>
			</div>
		</footer>
	</div>
</article>
