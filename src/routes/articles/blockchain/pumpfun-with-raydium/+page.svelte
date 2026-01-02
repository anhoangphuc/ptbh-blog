<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import hljs from 'highlight.js/lib/core';
	import rust from 'highlight.js/lib/languages/rust';
    import bash from 'highlight.js/lib/languages/bash';
    import ini from 'highlight.js/lib/languages/ini';
	import 'highlight.js/styles/github-dark.css';

	import '$lib/styles/article.css';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

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
			<h1 class="article-title">How does Pump.fun create a liquidity pool on Raydium?</h1>
			<p class="article-subtitle">
                A coding tour explaining how Pump.fun creates a liquidity pool on Raydium in an atomic and automated way.
                This simplified example demonstrates how and why Pump stores liquidity and migrates it to Raydium when possible.
			</p>
		</header>

        <!-- Key Features -->
        <section class="feature-grid">
            <h2 class="article-section-title">What you will learn</h2>
            <div class="feature-grid-items">
                <div class="feature-item">
                    <h3 class="feature-item-title">Solana Account Types</h3>
                    <p class="feature-item-text">
                        Introduction to the basic types of accounts in Solana and
                        when to use each type in different circumstances.
                    </p>
                </div>
                <div class="feature-item">
                    <h3 class="feature-item-title">Raydium Instructions</h3>
                    <p class="feature-item-text">
                        Learn how to integrate with the Raydium SDK and use instructions to create a liquidity pool.
                    </p>
                </div>
                <div class="feature-item">
                    <h3 class="feature-item-title">CPI to create a liquidity pool</h3>
                    <p class="feature-item-text">
                        Learn how to store assets in a program and invoke CPI to create a liquidity pool on Raydium.
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
						<strong>Pump.fun</strong>, the largest meme coin launchpad on Solana, offers a powerful feature:
						when a token reaches a certain price threshold, it can be paired with SOL to create a Raydium pool.
						The process involves three simple steps:
					</p>
					<ul class="article-list list-disc">
						<li>Create a meme token on the Pump.fun program</li>
						<li>Swap the meme token on the Pump.fun program</li>
						<li>Once the meme token's price reaches a target value, migrate the SOL and tokens from Pump.fun to
							create a Raydium pool, enabling trading on Raydium</li>
					</ul>
				</div>
                <div>
                    <p class="article-text">
                        The success of Pump.fun has inspired many developers to create their own forks.
                        Steps 1 and 2 are straightforward since they occur entirely within your forked program.
                        However, step 3 presents a challenge: migrating your assets to Raydium.
                        There are two main difficulties:
                    </p>
                    <ul class="article-list list-disc">
                        <li>Building the correct Raydium instructions</li>
                        <li>Understanding Solana's account management system</li>
                    </ul>
                </div>
				<p class="article-text">
                    This article will walk through these challenges step by step and demonstrate how to overcome them.
				</p>

			</section>

			<!-- Code Example -->
			<section class="article-section">
				<h2 class="article-section-title">How does Solana manage accounts</h2>
				<p class="article-text">
                    First, you need to understand the basics of Solana accounts. You can find detailed information in the official documentation.
                    The content below focuses on what's needed for this article. If you're already familiar with Solana accounts,
                    feel free to skip to the next section.
				</p>
                <p class="article-text">
                    Everything in Solana is an account. An account contains the following information:
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
                        Based on the <code>executable</code> field, we can divide Solana accounts into two categories:
                    </p>

                    <ul class="article-list list-disc">
                        <li>
                            <strong>Program account:</strong> An account with <code>executable = true</code>. This account
                            contains executable code. Deployed smart contracts use this type.
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
                    Now let's address the main purpose of this article: creating a Solana program that can migrate assets and create a Raydium pool.
                    This section includes code examples, iterative updates, and references to a GitHub repository demonstrating the final implementation.
				</p>

				<p class="article-text">
                    This article assumes you're familiar with Anchor and how to build programs on Solana using Anchor.
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
                    In our <code>FPump</code> program, we use simplified logic supporting two instructions:
				</p>
                <ul class="article-list list-disc">
                    <li>
                        <strong>create_token</strong>: Creates a new mint, mints 1,000,000 tokens, and transfers 10 SOL into the vault.
                        These assets are used to create a Raydium pool instead of waiting for users to swap.
                    </li>
                    <li>
                        <strong>migrate</strong>: Creates a Raydium pool with 1,000,000 tokens and 10 SOL.
                    </li>
                </ul>
                </div>
			</section>

            <section class="article-section">
				<h2 class="article-section-title">Create a new token</h2>
                <p class="article-text">
                    We create a new mint token with 6 decimals, initialize a Vault PDA that stores 1,000,000 of the newly created tokens,
                    and transfer 10 SOL into the vault. Check the <code>mint-token</code> branch for more details.
                </p>
                <p class="article-text">
                    Raydium requires wrapped SOL (wSOL) instead of native SOL when creating a liquidity pool.
                    Therefore, in our <code>FPump</code> program, we receive native SOL and convert it to wSOL using the <code>sync_native</code> instruction.
                </p>
                <p class="article-text">
                    Please check the branch <b><code><a href="https://github.com/anhoangphuc/pumpfun-migrate-raydium/tree/feat/mint-token">mint-token</a></code></b> for more details
                </p>


				<CodeBlock
					code={createTokenCode}
					language="rust"
					filename="create_token.rs"
					maxLines={20}
				/>

            </section>

            <section class="article-section">
                <h2 class="article-section-title">Create a Raydium pool</h2>

                <p class="article-text">
                    So far so good. Now let's create a Raydium pool. There are several Raydium programs available for creating pools,
                    each corresponding to specific pool logic. In this article, we use the latest version of CPMM, which is optimized
                    for pools that pair SOL with a token.
                </p>

                <p class="article-text">
                    First, you need to install CPMM. Add this dependency to your <code>Cargo.toml</code>, then rebuild your program.
                </p>

                <div class="code-container">
                    <div class="code-header">
                        <span class="code-filename">Cargo.toml</span>
                        <span class="code-language">Toml</span>
                    </div>
                    <pre class="code-block"><code class="ini">{addCPMMCargoCode}</code></pre>
                </div>

                <div class="article-text">
                    Now, let's create a <code>migrate</code> instruction in <code>FPump</code> that calls the <code>initialize</code> instruction to create a new pool in the CPMM program.
                    Please check the branch <b><code><a href="https://github.com/anhoangphuc/pumpfun-migrate-raydium/tree/feat/migrate">migrate</a></code></b> for more details
                </div>

				<CodeBlock
					code={migrateRaydiumCode}
					language="rust"
					filename="migrate.rs"
					maxLines={25}
				/>
            </section>

            <p class="article-text">
                Everything appears ready. However, when we execute the migration instruction, we encounter an error:
            </p>

            <ErrorDisplay
                title="AnchorError"
                account="vault"
                errorCode="AccountNotSystemOwned"
                errorNumber={3011}
                message="The given account is not owned by the system program."
            />

            <p class="article-text"><strong>What went wrong?</strong></p>


            <section class="article-section">
                <h2 class="article-section-title">Let's correct the error</h2>
                <p class="article-text">
                    The error message is clear: <code>account: vault. Error Code: AccountNotSystemOwned.</code>
                </p>

                <p class="article-text">The <code>migrate</code> instruction requires <code>vault</code> to be owned by the SystemProgram.</p>
                <div class="code-container">
                    <div class="code-header">
                        <span class="code-filename">initialize.rs</span>
                        <span class="code-language">Rust</span>
                    </div>
                    <pre class="code-block"><code class="rust">{shortenInitializeCode}</code></pre>
                </div>

                <p class="article-text">
                    Why? <code>vault</code> is declared as <code>creator</code> in the <code>initialize</code> instruction,
                    and this <code>creator</code> is responsible for paying the creation fee for the <code>lp_token</code>. Only a <code>SystemAccount</code> can pay that fee.
                </p>
                <p class="article-text">
                    However, <code>vault</code> is not a SystemAccount. Instead, it's a <strong>Program State Account</strong> managed by the <code>FPump</code> program because we already initialized it.
                    To fix this, we simply skip the <code>init</code> step. By default, all uninitialized accounts are owned by the SystemProgram.
                    With this change, everything works perfectly. You can check the <code>master</code> branch for the final code.
                </p>

                <p class="article-text">
                    Please check the branch <b><code><a href="https://github.com/anhoangphuc/pumpfun-migrate-raydium">main</a></code></b> for more details
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
					Successfully migrating assets from a Pump.fun-style program to Raydium requires understanding two critical concepts:
                    Solana's account ownership model and proper instruction construction.
                    The key insight is recognizing that only SystemAccounts can pay transaction fees and rent fees—a requirement
                    that necessitates careful account initialization.
				</p>
				<p class="article-text">
					By storing assets by a SystemAccount-owned PDA account and invoking Raydium's CPMM initialize instruction via CPI,
                    we achieve atomic liquidity migration. This pattern enables automated market making without manual intervention,
                    creating a seamless transition from bonding curve trading to full DEX liquidity.
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
