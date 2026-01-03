<script lang="ts">
	import type { PageData } from './$types';
	import '$lib/styles/article.css';

	const { data }: { data: PageData } = $props();
	const articles = $derived(data.articles);
</script>

<svelte:head>
	<title>Blockchain Articles - PTBH Blog</title>
	<meta name="description" content="Explore blockchain development tutorials and articles" />
</svelte:head>

<div class="article-container">
	<div class="mx-auto max-w-6xl">
		<!-- Header Section -->
		<header class="article-header text-center">
			<div class="article-meta justify-center">
				<span class="article-category">Blockchain</span>
				<span>•</span>
				<span>{articles.length} {articles.length === 1 ? 'Article' : 'Articles'}</span>
			</div>
			<h1 class="article-title">Blockchain Development</h1>
			<p class="article-subtitle">
				Deep dives into blockchain development, smart contracts, and decentralized applications on Solana and beyond
			</p>
		</header>

		<!-- Articles Grid -->
		{#if articles.length > 0}
			<div class="articles-grid">
				{#each articles as article}
					<a href="/articles/blockchain/{article.slug}" class="article-card">
						<!-- Card Header with Tags -->
						<div class="article-card-header">
							<div class="article-card-tags">
								{#each article.tags as tag}
									<span class="article-tag">{tag}</span>
								{/each}
							</div>
							<div class="article-card-meta">
								<time datetime={article.date}>
									{new Date(article.date).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</time>
								<span>•</span>
								<span>{article.readTime}</span>
							</div>
						</div>

						<!-- Card Content -->
						<div class="article-card-content">
							<h2 class="article-card-title">{article.title}</h2>
							<p class="article-card-description">{article.description}</p>
						</div>

						<!-- Card Footer -->
						<div class="article-card-footer">
							<span class="article-card-link">
								Read Full Article
								<svg
									class="article-card-arrow"
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M6 3L11 8L6 13"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				<div class="empty-state-icon">
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2" />
						<line x1="16" y1="24" x2="48" y2="24" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						<line x1="16" y1="32" x2="40" y2="32" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						<line x1="16" y1="40" x2="44" y2="40" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
					</svg>
				</div>
				<h3 class="empty-state-title">No Articles Yet</h3>
				<p class="empty-state-text">Check back soon for new blockchain articles and tutorials!</p>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Articles Grid Layout */
	.articles-grid {
		display: grid;
		gap: 2rem;
		margin-bottom: 4rem;
	}

	@media (min-width: 768px) {
		.articles-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Article Card */
	.article-card {
		display: flex;
		flex-direction: column;
		background: white;
		border-radius: 0.75rem;
		overflow: hidden;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;
		border: 1px solid rgb(226, 232, 240);
	}

	.article-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		border-color: rgb(196, 181, 253);
	}

	/* Card Header */
	.article-card-header {
		padding: 1.5rem 1.5rem 1rem;
		border-bottom: 1px solid rgb(241, 245, 249);
	}

	.article-card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.article-tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		background-color: rgb(243, 232, 255);
		color: rgb(126, 34, 206);
	}

	.article-card-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: rgb(100, 116, 139);
		font-family: 'Inter', sans-serif;
	}

	/* Card Content */
	.article-card-content {
		flex: 1;
		padding: 1.5rem;
	}

	.article-card-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.3;
		color: rgb(15, 23, 42);
		margin-bottom: 0.75rem;
		transition: color 0.2s;
	}

	.article-card:hover .article-card-title {
		color: rgb(126, 34, 206);
	}

	.article-card-description {
		font-family: 'Inter', sans-serif;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: rgb(71, 85, 105);
	}

	/* Card Footer */
	.article-card-footer {
		padding: 1rem 1.5rem;
		background-color: rgb(248, 250, 252);
		border-top: 1px solid rgb(226, 232, 240);
	}

	.article-card-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: rgb(126, 34, 206);
		transition: gap 0.2s;
	}

	.article-card:hover .article-card-link {
		gap: 0.75rem;
	}

	.article-card-arrow {
		transition: transform 0.2s;
		color: rgb(126, 34, 206);
	}

	.article-card:hover .article-card-arrow {
		transform: translateX(2px);
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 0.75rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	}

	.empty-state-icon {
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.5rem;
		color: rgb(148, 163, 184);
	}

	.empty-state-title {
		font-family: 'Playfair Display', serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: rgb(15, 23, 42);
		margin-bottom: 0.5rem;
	}

	.empty-state-text {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		color: rgb(100, 116, 139);
		text-align: center;
		max-width: 32rem;
	}
</style>
