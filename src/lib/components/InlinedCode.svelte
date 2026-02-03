<script lang="ts">
	let {
		variable,
		color = 'gray',
		strong = false
	}: { variable: string; color?: string; strong?: boolean } = $props();

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

{#if strong}
	<strong>
		<code class="rounded px-2 py-1 text-sm {colorClasses}">{variable}</code>
	</strong>
{:else}
	<code class="rounded px-2 py-1 text-sm {colorClasses}">{variable}</code>
{/if}
