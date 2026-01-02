# Shared Library

This directory contains shared code and assets used across the blog.

## Components

### CodeBlock.svelte
Reusable code block component with collapsible functionality for long code snippets.

**Props:**
- `code` (string, required): The code to display
- `language` (string, required): Programming language for syntax highlighting
- `filename` (string, optional): Filename to display in the header
- `maxLines` (number, optional): Maximum lines to show before collapsing. If not provided, shows full code.

**Usage:**
```svelte
<script>
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import hljs from 'highlight.js/lib/core';
  import rust from 'highlight.js/lib/languages/rust';

  hljs.registerLanguage('rust', rust);

  const code = `fn main() { ... }`;
</script>

<CodeBlock
  code={code}
  language="rust"
  filename="main.rs"
  maxLines={20}
/>
```

**Features:**
- Automatic syntax highlighting using highlight.js
- Collapsible for long code snippets
- Smooth expand/collapse animation
- Gradient fade effect when collapsed
- Beautiful expand button with hover effects

## Styles

### article.css
Shared styling for blog articles. Provides:
- Typography (Playfair Display, Inter, JetBrains Mono)
- Article layout classes
- Code block styling (including collapsible code blocks)
- Feature grids and info boxes

**Usage:**
```svelte
<script>
  import '$lib/styles/article.css';
</script>

<article class="article-container">
  <h1 class="article-title">Your Article Title</h1>
  <p class="article-text">Your content...</p>
</article>
```

**Code Block CSS Classes:**
- `.code-container` - Main code block wrapper
- `.code-header` - Code block header with filename
- `.code-block` - Code content area
- `.code-expand-button` - Expand/collapse button
- `.code-block-content.collapsed` - Collapsed state with gradient

See the Pump.fun article for a complete example: `src/routes/articles/blockchain/pumpfun-with-raydium/+page.svelte`
