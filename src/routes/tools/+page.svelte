<script lang="ts">
	import type { PageData } from './$types';
	import '$lib/styles/article.css';
	import '$lib/styles/articles-listing.css';

	const { data }: { data: PageData } = $props();
	const tools = $derived(data.tools);
</script>

<svelte:head>
	<title>Developer Tools - PTBH Blog</title>
	<meta name="description" content="Explore useful developer tools and utilities" />
</svelte:head>

<div class="article-container">
	<div class="mx-auto max-w-6xl">
		<!-- Header Section -->
		<header class="article-header text-center">
			<div class="article-meta justify-center">
				<span class="article-category bg-green-100 text-green-700">Tools</span>
				<span>•</span>
				<span>{tools.length} {tools.length === 1 ? 'Tool' : 'Tools'}</span>
			</div>
			<h1 class="article-title">Developer Tools</h1>
			<p class="article-subtitle">
				Practical tools and utilities for blockchain development and testing
			</p>
		</header>

		<!-- Tools Grid -->
		{#if tools.length > 0}
			<div class="articles-grid">
				{#each tools as tool}
					<a href="/tools/{tool.slug}" class="article-card">
						<!-- Card Header with Tags -->
						<div class="article-card-header">
							<div class="article-card-tags">
								{#each tool.tags as tag}
									<span class="article-tag tag-green">{tag}</span>
								{/each}
							</div>
							<div class="article-card-meta">
								<time datetime={tool.date}>
									{new Date(tool.date).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</time>
								<span>•</span>
								<span>{tool.readTime}</span>
							</div>
						</div>

						<!-- Card Content -->
						<div class="article-card-content">
							<h2 class="article-card-title">{tool.title}</h2>
							<p class="article-card-description">{tool.description}</p>
						</div>

						<!-- Card Footer -->
						<div class="article-card-footer">
							<span class="article-card-link">
								View Tool
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
					<svg
						width="64"
						height="64"
						viewBox="0 0 64 64"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="12"
							y="8"
							width="40"
							height="48"
							rx="4"
							stroke="currentColor"
							stroke-width="2"
						/>
						<circle cx="32" cy="24" r="6" stroke="currentColor" stroke-width="2" />
						<path
							d="M22 44C22 38.4772 26.4772 34 32 34C37.5228 34 42 38.4772 42 44"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<h3 class="empty-state-title">No Tools Yet</h3>
				<p class="empty-state-text">Check back soon for new developer tools and utilities!</p>
			</div>
		{/if}
	</div>
</div>
