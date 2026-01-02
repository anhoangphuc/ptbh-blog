<script lang="ts">
	import { onMount } from 'svelte';
	import hljs from 'highlight.js/lib/core';

	interface Props {
		code: string;
		language: string;
		filename?: string;
		maxLines?: number;
	}

	let { code, language, filename, maxLines = undefined }: Props = $props();

	let isExpanded = $state(false);
	let shouldShowButton = $state(false);
	let codeElement: HTMLElement;

	// Calculate max height based on number of lines (approximate 1.5rem per line)
	const maxHeightStyle = $derived.by(() => {
		return maxLines ? `${maxLines * 1.5}rem` : 'none';
	});

	onMount(() => {
		if (codeElement) {
			hljs.highlightElement(codeElement);

			// Check if code has more lines than maxLines
			if (maxLines) {
				const lineCount = code.split('\n').length;
				shouldShowButton = lineCount > maxLines;
			}
		}
	});

	function toggleExpand() {
		isExpanded = !isExpanded;
	}
</script>

<div class="code-container">
	<div class="code-header">
		<span class="code-filename">{filename || `code.${language}`}</span>
		<span class="code-language">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
	</div>
	<div class="code-block-wrapper">
		<div
			class="code-block-content {!isExpanded && shouldShowButton ? 'collapsed' : ''}"
			style="--max-height: {maxHeightStyle}"
		>
			<pre class="code-block"><code bind:this={codeElement} class={language}>{code}</code></pre>
		</div>
		{#if shouldShowButton}
			<button class="code-expand-button" onclick={toggleExpand}>
				<span>{isExpanded ? 'Show less' : 'Show more'}</span>
				<span class="code-expand-icon {isExpanded ? 'expanded' : ''}">▼</span>
			</button>
		{/if}
	</div>
</div>
