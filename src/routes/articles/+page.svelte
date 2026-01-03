<script lang="ts">
	import type { PageData } from './$types';
	import '$lib/styles/article.css';
	import '$lib/styles/articles-listing.css';

	const { data }: { data: PageData } = $props();
	const articles = $derived(data.articles);

	// Group articles by category for stats
	const articlesByCategory = $derived.by(() => {
		const grouped: Record<string, number> = {};
		articles.forEach((article) => {
			grouped[article.categoryLabel] = (grouped[article.categoryLabel] || 0) + 1;
		});
		return grouped;
	});
</script>

<svelte:head>
	<title>All Articles - PTBH Blog</title>
	<meta name="description" content="Browse all technical articles across blockchain, algorithms, and software engineering" />
</svelte:head>

<div class="article-container">
	<div class="mx-auto max-w-6xl">
		<!-- Header Section -->
		<header class="article-header text-center">
			<div class="article-meta justify-center">
				<span class="article-category">All Articles</span>
				<span>•</span>
				<span>{articles.length} {articles.length === 1 ? 'Article' : 'Articles'}</span>
			</div>
			<h1 class="article-title">Technical Articles</h1>
			<p class="article-subtitle">
				Explore in-depth tutorials and insights on blockchain, algorithms, and software engineering
			</p>
		</header>

		<!-- Category Stats -->
		{#if Object.keys(articlesByCategory).length > 0}
			<div class="category-stats">
				{#each Object.entries(articlesByCategory) as [category, count]}
					<div class="category-stat-item">
						<span class="category-stat-label">{category}</span>
						<span class="category-stat-count">{count}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Articles Grid -->
		{#if articles.length > 0}
			<div class="articles-grid">
				{#each articles as article}
					<a href="/articles/{article.category}/{article.slug}" class="article-card">
						<!-- Card Header with Tags -->
						<div class="article-card-header">
							<div class="article-card-tags">
								<!-- Category badge first -->
								<span class="article-tag article-tag-category">{article.categoryLabel}</span>
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
				<p class="empty-state-text">Check back soon for new articles and tutorials!</p>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Category Stats */
	.category-stats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 3rem;
		padding: 1.5rem;
		background: white;
		border-radius: 0.75rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	}

	.category-stat-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgb(250, 245, 255), rgb(252, 231, 243));
		border-radius: 9999px;
		border: 1px solid rgb(233, 213, 255);
	}

	.category-stat-label {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: rgb(126, 34, 206);
	}

	.category-stat-count {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 1.5rem;
		height: 1.5rem;
		padding: 0 0.375rem;
		background: rgb(126, 34, 206);
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		border-radius: 9999px;
	}

	/* Category tag styling */
	.article-tag-category {
		background-color: rgb(224, 242, 254);
		color: rgb(3, 105, 161);
		font-weight: 600;
	}
</style>
