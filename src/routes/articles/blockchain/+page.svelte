<script lang="ts">
	import type { PageData } from './$types';
	import '$lib/styles/article.css';
	import '$lib/styles/articles-listing.css';

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
				Deep dives into blockchain development, smart contracts, and decentralized applications
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
