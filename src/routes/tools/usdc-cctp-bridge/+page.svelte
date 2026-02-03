<script lang="ts">
	import '$lib/styles/article.css';
	import 'highlight.js/styles/github-dark.css';
	import sepoliaToSolanaImage from '$lib/assets/tools/usdc-cctp-bridge/sepolia_to_solana.png';
</script>

<svelte:head>
	<title>USDC CCTP Bridge for ETH and Solana</title>
	<meta name="description" content="USDC CCTP Bridge for ETH and Solana" />
</svelte:head>

<article class="article-container">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<header class="article-header">
			<div class="article-meta">
				<span class="article-category">Tools</span>
				<span>•</span>
				<time datetime="2026-01-12">January 12, 2026</time>
				<span>•</span>
				<span>5 min read</span>
			</div>
			<h1 class="article-title">USDC Testnet Bridge between ETH and Solana</h1>
			<p class="article-subtitle">
				A simple tool for bridging USDC between ETH Sepolia and Solana Devnet using Circle's
				Cross-Chain Transfer Protocol (CCTP).
			</p>
		</header>

		<!-- Content -->
		<div class="article-content">
			<section class="article-section">
				<h2 class="article-section-title">Introduction</h2>
				<div>
					<p class="article-text">
						USDC is a fully-reserved stablecoin pegged 1:1 to the US dollar, widely used across
						multiple blockchains. Circle's Cross-Chain Transfer Protocol (CCTP) enables native USDC
						transfers between chains by burning tokens on the source chain and minting equivalent
						amounts on the destination chain.
					</p>
					<p class="article-text">
						After searching for a while without finding a suitable testnet bridging tool, I built
						one myself. This tool allows you to bridge USDC between Ethereum Sepolia and Solana
						Devnet for testing purposes.
					</p>

					<p class="article-text">
						TRY IT OUT AT <b
							><a href="https://cctp-bridged.vercel.app/" target="_blank">USDC BRIDGE</a></b
						>
						<i
							><a href="https://cctp-bridged.vercel.app/" target="_blank"
								>(https://cctp-bridged.vercel.app/)</a
							></i
						>
					</p>

					<div class="my-8">
						<img
							src={sepoliaToSolanaImage}
							alt="USDC Bridge from Sepolia to Solana"
							class="w-full rounded-xl shadow-lg"
						/>
						<p class="mt-2 text-center text-sm text-slate-600">
							Bridge interface showing USDC transfer from ETH Sepolia to Solana Devnet
						</p>
					</div>
				</div>
			</section>

			<section class="article-section">
				<h2 class="article-section-title">Technical Details</h2>
				<div class="article-text">
					The Cross-Chain Transfer Protocol (CCTP) is a permissionless protocol for transferring
					native USDC across supported blockchains. It works by burning USDC on the source chain and
					minting an equivalent amount on the destination chain, enabling seamless and secure value
					transfer. For more information, see <b
						><a href="https://www.circle.com/cross-chain-transfer-protocol" target="_blank"
							>Circle's official CCTP documentation</a
						></b
					>.
				</div>

				<div class="article-text">
					This tool is built using only official CCTP dependencies—no additional smart contracts or
					centralized services required. The entire bridging process relies on Circle's
					battle-tested infrastructure.
				</div>

				<div class="article-text">
					The bridging process between ETH and Solana (and vice versa) involves three steps:
					<ul class="article-list list-disc">
						<li>
							Burn USDC on the source chain using the <b
								><a
									href="https://developers.circle.com/cctp/evm-smart-contracts#tokenmessengerv2:-testnet"
									target="_blank">TokenMessengerV2 contract</a
								></b
							>
						</li>
						<li>
							Fetch attestation proof of the burn from <b
								><a
									href="https://developers.circle.com/api-reference/cctp/all/get-attestation"
									target="_blank">Circle's Iris Attestation Service</a
								></b
							>
						</li>
						<li>
							Mint USDC on the destination chain using the <b
								><a
									href="https://developers.circle.com/cctp/evm-smart-contracts#messagetransmitterv2:-testnet"
									target="_blank">MessageTransmitterV2 contract</a
								></b
							>
						</li>
					</ul>
					For a detailed walkthrough, check out the<b
						><a href="https://cctp-bridged.vercel.app/tutorial" target="_blank"
							>step-by-step tutorial</a
						></b
					>.
				</div>

				<div class="article-text">
					The complete source code is available on <b
						><a href="https://github.com/anhoangphuc/cctp-bridged" target="_blank">GitHub</a></b
					>. You can download it and run it locally on your machine. Contributions via pull requests
					are welcome!
				</div>
			</section>
		</div>
	</div>
</article>
