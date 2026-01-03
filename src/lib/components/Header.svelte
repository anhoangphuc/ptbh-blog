<script lang="ts">
	let isArticlesOpen = $state(false);

	function toggleArticles() {
		isArticlesOpen = !isArticlesOpen;
	}

	function closeDropdown() {
		isArticlesOpen = false;
	}
</script>

<header class="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
	<nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<div class="flex-shrink-0">
				<a href="/" class="text-xl font-bold text-slate-900" style="font-family: 'Playfair Display', serif;">
					PTBH Blog
				</a>
			</div>

			<!-- Navigation Links -->
			<div class="flex items-center gap-8">
				<!-- Articles Dropdown -->
				<div class="relative">
					<button
						onclick={toggleArticles}
						class="flex items-center gap-1 text-slate-700 transition-colors hover:text-slate-900"
					>
						Articles
						<span class="transition-transform {isArticlesOpen ? 'rotate-180' : ''}" style="font-size: 0.75rem;">▼</span>
					</button>

					{#if isArticlesOpen}
						<div class="absolute left-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
							<div class="py-2">
								<a
									href="/articles/blockchain"
									onclick={closeDropdown}
									class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
								>
									Blockchain
								</a>
								<a
									href="/articles/algorithm"
									onclick={closeDropdown}
									class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
								>
									Algorithm
								</a>
								<a
									href="/articles/software"
									onclick={closeDropdown}
									class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
								>
									Software
								</a>
							</div>
						</div>
					{/if}
				</div>

				<!-- Tools -->
				<a href="/tools" class="text-slate-700 transition-colors hover:text-slate-900">
					Tools
				</a>

				<!-- About Me -->
				<a href="/about" class="text-slate-700 transition-colors hover:text-slate-900">
					About Me
				</a>
			</div>
		</div>
	</nav>
</header>

<!-- Overlay to close dropdown when clicking outside -->
{#if isArticlesOpen}
	<div
		class="fixed inset-0 z-40"
		onclick={closeDropdown}
		role="button"
		tabindex="-1"
		aria-label="Close dropdown"
	></div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
</style>
