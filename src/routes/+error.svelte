<script lang="ts">
	import { page } from '$app/stores';
	import '$lib/styles/article.css';
</script>

<svelte:head>
	<title>Page Not Found - PTBH Blog</title>
</svelte:head>

<div class="article-container">
	<div class="mx-auto max-w-3xl">
		<div class="error-page">
			<!-- 404 Illustration -->
			<div class="error-illustration">
				<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
					<!-- 404 Text -->
					<text x="100" y="120" text-anchor="middle" style="font-family: 'Playfair Display', serif; font-size: 72px; font-weight: 700; fill: rgb(126, 34, 206); opacity: 0.2;">
						404
					</text>
					<!-- Magnifying Glass -->
					<circle cx="80" cy="80" r="30" stroke="rgb(126, 34, 206)" stroke-width="4" fill="none" />
					<line x1="102" y1="102" x2="130" y2="130" stroke="rgb(126, 34, 206)" stroke-width="4" stroke-linecap="round" />
				</svg>
			</div>

			<!-- Error Message -->
			<div class="error-content">
				<h1 class="error-title">Oops! Page Not Found</h1>
				<p class="error-message">
					The page you're looking for doesn't exist yet. It might be under construction, or perhaps you've stumbled upon a path less traveled.
				</p>

				<!-- Status Code Badge -->
				{#if $page.status}
					<div class="error-badge">
						<span class="article-category">Error {$page.status}</span>
					</div>
				{/if}

				<!-- Navigation Options -->
				<div class="error-actions">
					<a href="/" class="error-button error-button-primary">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2 8L8 2L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M3 7V14H7V10H9V14H13V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						Go Home
					</a>
					<a href="/articles/blockchain" class="error-button error-button-secondary">
						Browse Articles
					</a>
				</div>

				<!-- Helpful Message -->
				<div class="error-help">
					<p class="article-text" style="text-align: center; color: rgb(100, 116, 139); font-size: 0.875rem;">
						Looking for something specific? Try starting from the home page or check out the latest blockchain articles.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		text-align: center;
		padding: 2rem;
	}

	.error-illustration {
		margin-bottom: 2rem;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.error-content {
		max-width: 42rem;
	}

	.error-title {
		font-family: 'Playfair Display', serif;
		font-size: 2.5rem;
		font-weight: 700;
		color: rgb(15, 23, 42);
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 768px) {
		.error-title {
			font-size: 3rem;
		}
	}

	.error-message {
		font-family: 'Inter', sans-serif;
		font-size: 1.125rem;
		line-height: 1.75;
		color: rgb(71, 85, 105);
		margin-bottom: 2rem;
	}

	.error-badge {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.error-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.error-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-family: 'Inter', sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
		border: 2px solid transparent;
	}

	.error-button-primary {
		background-color: rgb(126, 34, 206);
		color: white;
		box-shadow: 0 1px 3px 0 rgba(126, 34, 206, 0.3);
	}

	.error-button-primary:hover {
		background-color: rgb(107, 33, 168);
		box-shadow: 0 4px 6px -1px rgba(126, 34, 206, 0.3), 0 2px 4px -1px rgba(126, 34, 206, 0.2);
		transform: translateY(-1px);
	}

	.error-button-secondary {
		background-color: white;
		color: rgb(126, 34, 206);
		border-color: rgb(126, 34, 206);
	}

	.error-button-secondary:hover {
		background-color: rgb(250, 245, 255);
		transform: translateY(-1px);
	}

	.error-help {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid rgb(226, 232, 240);
	}
</style>
