# Shared Library

This directory contains shared code and assets used across the blog.

## Styles

### article.css
Shared styling for blog articles. Provides:
- Typography (Playfair Display, Inter, JetBrains Mono)
- Article layout classes
- Code block styling
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

See the Pump.fun article for a complete example: `src/routes/articles/blockchain/pumpfun-with-raydium/+page.svelte`
