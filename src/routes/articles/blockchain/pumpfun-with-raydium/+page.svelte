<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import hljs from 'highlight.js/lib/core';
	import rust from 'highlight.js/lib/languages/rust';
    import bash from 'highlight.js/lib/languages/bash';
    import ini from 'highlight.js/lib/languages/ini';
	import 'highlight.js/styles/github-dark.css';

	import '$lib/styles/article.css';

	const { data }: { data: PageData } = $props();
	const prerequisitesCode = $derived(data.prerequisitesCode);
	const accountDetailCode = $derived(data.accountDetailCode);
    const createTokenCode = $derived(data.createTokenCode);
    const addCPMMCargoCode = $derived(data.addCPMMCargoCode);
    const migrateRaydiumCode = $derived(data.migrateRaydiumCode);
    const shortenInitializeCode = $derived(data.shortenInitializeCode);
    const fixErrorCode = $derived(data.fixErrorCode);

	hljs.registerLanguage('rust', rust);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('toml', ini);

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
				<h2 class="article-section-title">How does Solana manage accounts</h2>
				<p class="article-text">
                    First of all, you need to understand the basics of Solana accounts. You can find detailed information about here.
                    Below contents focus on what needed for this article. If you are familiar with Solana accounts,
                    feel free to skip to the next part of this article.
				</p>
                <p class="article-text">
                    Everything in Solana is an account. An account contains following information:
                </p>

				<div class="code-container">
					<div class="code-header">
						<span class="code-filename">account.rs</span>
						<span class="code-language">Rust</span>
					</div>
					<pre class="code-block"><code class="rust">{accountDetailCode}</code></pre>
				</div>

                <div>
                    <p class="article-text">
                        Based on <code>executable</code> we can divide Solana account into two categories:
                    </p>

                    <ul class="article-list list-disc">
                        <li>
                            <strong>Program account:</strong> An account with <code>executable = true</code>. This account
                            contains executable code. Your deployed smart contract is this type.
                        </li>
                        <li>
                            <strong>Data account:</strong> An account with <code>executable = false</code>. This account
                            doesn't contain executable code and is used to store data for a program.
                        </li>
                    </ul>
                </div>

                <div>
                    <p class="article-text">
                        The <code>owner</code> is the program that owns the account. Only that program can
                        modify the account's state. Based on the <code>owner</code> address, we can divide
                        Solana accounts into four categories:
                    </p>

                    <ul class="article-list list-disc">
                        <li>
                            <strong>Program state account:</strong> An account whose <code>owner</code> is a user-deployed
                            program. It contains information related to that program.
                        </li>
                        <li>
                            <strong>System account:</strong> An account whose <code>owner</code> is the <code>System Program</code>. This
                            type of account can pay transaction fees.
                        </li>
                        <li>
                            <strong>Sysvar account:</strong> An account whose <code>owner</code> is the <code>Sysvar Program</code>. These
                            are predefined addresses that provide access to cluster state data.
                        </li>
                        <li>
                            <strong>Other:</strong> An account whose <code>owner</code> is built-in programs other than <code>System
                            program</code> or <code>Sysvar program</code>.
                        </li>
                    </ul>
                </div>

                <div>
                    <p class="article-text">
                        Each account is identified by a unique 32-byte ID called an address,
                        typically displayed as a base58-encoded string. Based on how addresses are
                        generated, Solana accounts fall into two categories:
                    </p>

                    <ul class="article-list list-disc">
                        <li>
                            <strong>Public key address:</strong> The account address is a public key from an
                            Ed25519 keypair. Whoever holds the corresponding private key can sign
                            for this account.
                        </li>
                        <li>
                            <strong>Program derived address (PDA):</strong> The account address is derived
                            deterministically using a <code>program's address</code> and one or more optional
                            seeds. This account has no private key. The Solana runtime allows the
                            program from which the PDA is derived to sign on its behalf.
                        </li>
                    </ul>
                </div>

				<!-- Summary Table -->
				<div class="my-8 overflow-hidden rounded-xl bg-white shadow-lg">
					<div class="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4">
						<h3 class="text-xl font-bold text-slate-900" style="font-family: 'Playfair Display', serif;">
							Solana Account Classification Summary
						</h3>
					</div>

					<!-- Table -->
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-slate-50">
								<tr>
									<th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Classification</th>
									<th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Category</th>
									<th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
									<th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Key Characteristic</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-200">
								<!-- By Executable -->
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900" rowspan="2">By <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs">executable</code></td>
									<td class="px-6 py-4 text-sm font-medium text-purple-700">Program Account</td>
									<td class="px-6 py-4 text-sm text-slate-600">Contains executable code</td>
									<td class="px-6 py-4 text-sm"><code class="rounded bg-purple-50 px-2 py-1 text-xs text-purple-700">executable = true</code></td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-purple-700">Data Account</td>
									<td class="px-6 py-4 text-sm text-slate-600">Stores data for programs</td>
									<td class="px-6 py-4 text-sm"><code class="rounded bg-purple-50 px-2 py-1 text-xs text-purple-700">executable = false</code></td>
								</tr>

								<!-- By Owner -->
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900" rowspan="4">By <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs">owner</code></td>
									<td class="px-6 py-4 text-sm font-medium text-blue-700">Program State Account</td>
									<td class="px-6 py-4 text-sm text-slate-600">Program-specific data storage</td>
									<td class="px-6 py-4 text-sm"><code class="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">owner = User Program</code></td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-blue-700">System Account</td>
									<td class="px-6 py-4 text-sm text-slate-600">Can pay transaction fees</td>
									<td class="px-6 py-4 text-sm"><code class="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">owner = System Program</code></td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-blue-700">Sysvar Account</td>
									<td class="px-6 py-4 text-sm text-slate-600">Cluster state data access</td>
									<td class="px-6 py-4 text-sm"><code class="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">owner = Sysvar Program</code></td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-blue-700">Other</td>
									<td class="px-6 py-4 text-sm text-slate-600">Other built-in programs</td>
									<td class="px-6 py-4 text-sm"><code class="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">owner = Other Built-in</code></td>
								</tr>

								<!-- By Address Generation -->
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-slate-900" rowspan="2">By Address</td>
									<td class="px-6 py-4 text-sm font-medium text-green-700">Public Key Address</td>
									<td class="px-6 py-4 text-sm text-slate-600">Ed25519 keypair-based</td>
									<td class="px-6 py-4 text-sm"><code class="rounded bg-green-50 px-2 py-1 text-xs text-green-700">Has private key</code></td>
								</tr>
								<tr class="hover:bg-slate-50">
									<td class="px-6 py-4 text-sm font-medium text-green-700">PDA</td>
									<td class="px-6 py-4 text-sm text-slate-600">Deterministically derived</td>
									<td class="px-6 py-4 text-sm"><code class="rounded bg-green-50 px-2 py-1 text-xs text-green-700">No private key</code></td>
								</tr>
							</tbody>
						</table>
					</div>
                </div>


				<!-- <div class="info-box">
					<p class="info-box-text">
						<strong>Note:</strong> This is a simplified educational example. The actual Pump.fun program
						includes additional security checks, fee calculations, and more sophisticated curve mathematics.
					</p>
				</div> -->
			</section>

			<!-- Integration with Raydium -->
			<section class="article-section">
				<h2 class="article-section-title">Create an FPump program</h2>
				<p class="article-text">
                    Now let's jump into the main purpose of this article: creating a Solana program that can migrate assets and create a Raydium pool.
                    This section includes code, iterative updates, and a GitHub repo demonstrating the final implementation.
				</p>

				<p class="article-text">
                    This article assumes you know what Anchor is and how to build a program on Solana using Anchor.
                    Let's prepare the prerequisites and initialize an Anchor program.
				</p>

                <div class="code-container">
					<div class="code-header">
						<span class="code-filename">account.rs</span>
						<span class="code-language">Rust</span>
					</div>
					<pre class="code-block"><code class="bash">{prerequisitesCode}</code></pre>
				</div>

                <div>
				<p class="article-text">
                    In our <code>FPump</code> program, we use simplified logic, supporting 2 instructions:
				</p>
                <ul class="article-list list-disc">
                    <li>
                        <strong>create_token</strong>: Create a new mint, mints 1000_000 tokens, and transfer 10 SOL into the vault.
                        This assets are used to create a Raydium pool, instead of waiting for the user to swap in.
                    </li>
                    <li>
                        <strong>migrate</strong>: Perform creating a Raydium pool with 1000_000 tokens and 10 SOL.
                    </li>
                </ul>
                </div>
			</section>

            <section class="article-section">
				<h2 class="article-section-title">Create a new token</h2>
                <p class="article-text">
                    We create a new mint token with 6 decimals.
                    We then initialize a Vault PDA that stores 1,000,000 of the newly created tokens, and transfer 10 SOL into the vault.
                    Check the branch mint-token for more details.
                </p>
                <p class="article-text">
                    Raydium requires wSOL instead of SOL when creating a liquidity pool.
                    So in our <code>FPump</code> program, we receive native SOL, then convert it to wSOL using <code>sync_native</code> instruction.
                </p>


                <div class="code-container">
					<div class="code-header">
						<span class="code-filename">create_token.rs</span>
						<span class="code-language">Rust</span>
					</div>
					<pre class="code-block"><code class="rust">{createTokenCode}</code></pre>
				</div>

            </section>

            <section class="article-section">
                <h2 class="article-section-title">Create a Raydium pool</h2>

                <p class="article-text">
                    So far so good. Now let's create a Raydium pool. There are several Raydium programs you can use to create a pool,
                    each corresponding to specific pool logic. In this article, we use the latest version of CPMM, which works best
                    for pools that pair SOL with a coin. 
                </p>

                <p class="article-text">
                    First, you need to install CPMM. Add this dependency in your Cargo.toml, then rebuild your program.
                </p>

                <div class="code-container">
                    <div class="code-header">
                        <span class="code-filename">Cargo.toml</span>
                        <span class="code-language">Toml</span>
                    </div>
                    <pre class="code-block"><code class="ini">{addCPMMCargoCode}</code></pre>
                </div>

                <div class="article-text">
                    Now, let's create an migrate instruction in <code>FPump</code> that calls the initialize instruction to create a new pool in CPMM program.
                </div>

                <div class="code-container">
                    <div class="code-header">
                        <span class="code-filename">migrate.rs</span>
                        <span class="code-language">Rust</span>
                    </div>
                    <pre class="code-block"><code class="rust">{migrateRaydiumCode}</code></pre>
                </div>
            </section>

            <p class="article-text">
                Everything is ready, right ?. We are happy until execute the migration instruction, we got an error:
            </p>
            <pre class="code-block">
                <code class="bash">Error: AnchorError caused by account: vault. Error Code: AccountNotSystemOwned. Error Number: 3011. Error Message: The given account is not owned by the system program. </code>
            </pre>
            <p class="article-text"><strong>NOO!!! WHY ??</strong></p>


            <section class="article-section">
                <h2 class="article-section-title">Let's correct the error</h2>
                <p class="article-text">
                    You can see the error: <code class="bash">account: vault. Error Code: AccountNotSystemOwned.</code>
                </p>

                <p class=article-text><strong><code>migrate</code></strong> instruction requires <strong><code>vault</code></strong> to be owned by the SystemProgram.</p>
                <div class="code-container">
                    <div class="code-header">
                        <span class="code-filename">initialize.rs</span>
                        <span class="code-language">Rust</span>
                    </div>
                    <pre class="code-block"><code class="rust">{shortenInitializeCode}</code></pre>
                </div>

                <p class=article-text>
                    Reasons ? <b><code>vault</code></b> is declared as <b><code>creator</code></b> in the <b><code>initialize</code></b> instruction,
                    and this <b><code>creator</code></b> is responsible for paying the fee creation for the lp_token. And only the <b><code>SystemAccount</code></b> can pay that fee.
                </p>
                <p class=article-text>
                    Of course, <b><code>vault</code></b> is not. Instead, it's a <b><code>Program State Account</code></b> managed by the <code>FPump</code> program. Because we have already initialized this account
                    To fix this, just skip the <code>init</code> step. By default, all unitialized accounts are owned by the SystemProgram.
                    And now, everything is perfect. You can check the master branch for the final code.
                </p>


                <div class="code-container">
                    <div class="code-header">
                        <span class="code-filename">create_token.rs</span>
                        <span class="code-language">Rust</span>
                    </div>
                    <pre class="code-block"><code class="rust">{fixErrorCode}</code></pre>
                </div>
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
