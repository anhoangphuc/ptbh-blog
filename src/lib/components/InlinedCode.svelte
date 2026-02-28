<script lang="ts">
	let {
		variable,
		color = 'gray',
		strong = false,
		href = undefined
	}: { variable: string; color?: string; strong?: boolean; href?: string } = $props();

	// Map color names to complete Tailwind classes
	const colorClasses = $derived.by(() => {
		switch (color) {
			case 'blue':
				return 'bg-blue-100 text-blue-700';
			case 'red':
				return 'bg-red-100 text-red-700';
			case 'green':
				return 'bg-green-100 text-green-700';
			case 'yellow':
				return 'bg-yellow-100 text-yellow-700';
			case 'purple':
				return 'bg-purple-100 text-purple-700';
			case 'pink':
				return 'bg-pink-100 text-pink-700';
			case 'indigo':
				return 'bg-indigo-100 text-indigo-700';
			case 'gray':
			default:
				return 'bg-gray-100 text-gray-700';
		}
	});
</script>

{#snippet codeEl()}
	<code class="rounded px-2 py-1 text-sm {colorClasses}">{variable}</code>
{/snippet}

{#if href}
	{#if strong}
		<strong
			><a {href} class="underline" target="_blank" rel="noopener noreferrer">{@render codeEl()}</a
			></strong
		>
	{:else}
		<a {href} class="underline" target="_blank" rel="noopener noreferrer">{@render codeEl()}</a>
	{/if}
{:else if strong}
	<strong>{@render codeEl()}</strong>
{:else}
	{@render codeEl()}
{/if}
