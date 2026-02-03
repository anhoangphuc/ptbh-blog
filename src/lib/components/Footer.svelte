<script lang="ts">
	import { page } from '$app/stores';

	const socialLinks = [
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/ta-phuc-437a12185/',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
				<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
			</svg>`
		},
		{
			name: 'Facebook',
			url: 'https://www.facebook.com/ta.ba.861428/',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
				<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
			</svg>`
		},
		{
			name: 'Telegram',
			url: 'https://t.me/hoangphucnb97',
			icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
				<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
			</svg>`
		}
	];

	// Derive parent path and check if on root route
	let pathname = $derived($page.url.pathname);
	let isRootRoute = $derived(pathname === '/');
	let parentPath = $derived(() => {
		const segments = pathname.split('/').filter((s) => s);
		if (segments.length === 0) return '/';
		segments.pop(); // Remove last segment
		return segments.length === 0 ? '/' : '/' + segments.join('/');
	});
</script>

<footer
	class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/80 py-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80"
>
	<div class="container mx-auto flex items-center justify-between px-4">
		<!-- Left: Back Navigation -->
		<div class="flex-1">
			{#if !isRootRoute}
				<a
					href={parentPath()}
					class="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Back
				</a>
			{/if}
		</div>

		<!-- Right: Social Links -->
		<div class="flex items-center gap-4">
			{#each socialLinks as social}
				<a
					href={social.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					aria-label={social.name}
				>
					{@html social.icon}
				</a>
			{/each}
		</div>
	</div>
</footer>
