# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a blog application built with SvelteKit 2.x, using Svelte 5 (with runes syntax), TypeScript, and Tailwind CSS 4.x. The project uses Vite as the build tool and follows modern SvelteKit conventions.

**Key Features:**
- Light/Dark theme support
- Code syntax highlighting for blog articles

## Commands

### Development
- `yarn dev` - Start development server
- `yarn dev -- --open` - Start dev server and open in browser

### Building
- `yarn build` - Create production build
- `yarn preview` - Preview production build locally

### Code Quality
- `yarn lint` - Run Prettier check and ESLint
- `yarn format` - Format all files with Prettier
- `yarn check` - Run Svelte type checking (syncs SvelteKit and runs svelte-check)
- `yarn check:watch` - Run type checking in watch mode

## Architecture

### Framework & Routing
This is a SvelteKit application using file-based routing. Routes are defined in `src/routes/`:
- `+page.svelte` files define page components
- `+layout.svelte` files define layout components that wrap pages
- `+server.ts` files would define API endpoints (none exist yet)

The app uses SvelteKit's automatic routing and code splitting.

### Svelte 5 Runes
This project uses Svelte 5 with the new runes syntax:
- `$props()` for component props instead of `export let`
- `$state()` for reactive state
- `$derived()` for derived values
- `{@render children()}` for rendering slot content

When creating or modifying components, use runes syntax, not the legacy Svelte syntax.

### Styling
Tailwind CSS 4.x is configured with:
- Vite plugin (`@tailwindcss/vite`)
- Main stylesheet: `src/routes/layout.css` (imported in root layout)
- Plugins: `@tailwindcss/forms` and `@tailwindcss/typography`
- Prettier plugin for automatic class sorting

Tailwind classes are auto-sorted by Prettier. Add Tailwind utilities directly in components.

### TypeScript Configuration
- Strict mode enabled
- Uses SvelteKit's generated tsconfig (`.svelte-kit/tsconfig.json`)
- Path alias `$lib` maps to `src/lib`
- The `prepare` script runs `svelte-kit sync` to generate types

### Code Quality Tools
ESLint configuration (`eslint.config.js`):
- Modern flat config format
- TypeScript ESLint with recommended rules
- Svelte plugin with recommended rules
- Prettier integration
- Custom rule: `no-undef` disabled for TypeScript files (typescript-eslint handles this)

Prettier configuration (`.prettierrc`):
- Uses tabs for indentation
- Single quotes
- No trailing commas
- 100 character line width
- Tailwind class sorting via plugin

### Build Configuration
- `vite.config.ts`: Uses Tailwind Vite plugin and SvelteKit plugin
- `svelte.config.js`: Uses `vitePreprocess()` and `adapter-auto`
- Adapter will automatically select the appropriate deployment adapter

## Project Structure

```
src/
  app.html              # HTML template
  app.d.ts              # TypeScript ambient declarations
  lib/                  # Shared library code ($lib alias)
    index.ts            # Library exports
    assets/             # Static assets like images, fonts
    styles/             # Shared CSS files
      article.css       # Article page styling (fonts, layout, code blocks)
  routes/               # File-based routing
    +layout.svelte      # Root layout
    +page.svelte        # Home page
    layout.css          # Global Tailwind styles
    articles/           # Blog articles
static/                 # Static files served at root
```

## Article Styling

Blog articles use a shared CSS file at `src/lib/styles/article.css` that provides:

### Typography
- **Playfair Display** (serif) for headings - elegant article titles
- **Inter** (sans-serif) for body text - clean and readable
- **JetBrains Mono** for code blocks - monospace optimized for code

### CSS Classes
Import the stylesheet in article pages:
```typescript
import '$lib/styles/article.css';
```

Available CSS classes:
- `.article-container` - Main article wrapper with gradient background
- `.article-header` - Article header section
- `.article-title` - Main title (uses Playfair Display)
- `.article-section-title` - Section headings
- `.article-text` - Body paragraphs
- `.code-container`, `.code-header`, `.code-block` - Code block styling
- `.feature-grid` - Grid layout for feature sections
- `.info-box` - Information/note boxes
- `.highlighted-section` - Highlighted content sections

### Creating New Articles
1. Create a new directory under `src/routes/articles/`
2. Add `+page.svelte` for the article content
3. Optionally add `+page.server.ts` for data loading (e.g., code examples)
4. Import `$lib/styles/article.css` for consistent styling
5. Use the CSS classes from the shared stylesheet

## Development Notes

### Adding New Pages
Create `.svelte` files in `src/routes/`. For a route `/about`:
- Create `src/routes/about/+page.svelte`
- Use Svelte 5 runes syntax

### Adding API Routes
Create `+server.ts` files in `src/routes/` to define API endpoints that export request handlers (`GET`, `POST`, etc.).

### Using $lib
Import from `$lib` to access code in `src/lib/`:
```typescript
import { something } from '$lib';
```

### Type Checking
Always run `yarn check` before committing to ensure TypeScript/Svelte types are valid. The `prepare` script ensures SvelteKit types are synced.

## Theme Support (Light/Dark Mode)

The blog supports light and dark themes. Implementation approach:

### Recommended Setup
Use Tailwind's built-in dark mode with class strategy:
- Configure `darkMode: 'class'` in Tailwind config (v4 uses `@theme` directive)
- Store theme preference in localStorage
- Apply `dark` class to `<html>` element based on user preference
- Use `dark:` variant for dark mode styles (e.g., `dark:bg-gray-900`)

### Implementation Pattern
Create a theme store in `$lib/stores/theme.ts` using Svelte 5 runes:
```typescript
import { browser } from '$app/environment';

function createThemeStore() {
  let theme = $state<'light' | 'dark'>(
    browser ? (localStorage.getItem('theme') as 'light' | 'dark') || 'light' : 'light'
  );

  return {
    get current() { return theme; },
    toggle() {
      theme = theme === 'light' ? 'dark' : 'light';
      if (browser) {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    },
    set(value: 'light' | 'dark') {
      theme = value;
      if (browser) {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    }
  };
}

export const themeStore = createThemeStore();
```

Add theme initialization in the root `+layout.svelte` to apply the saved preference on page load.

## Code Syntax Highlighting

For rendering code blocks in blog articles, use one of these recommended packages:

### Option 1: Shiki (Recommended)
Modern, VS Code-powered syntax highlighter with excellent theme support.

**Packages:** `shiki`, `rehype-shiki` (if using markdown processing)

**Benefits:**
- VS Code's TextMate grammar engine
- Perfect syntax highlighting accuracy
- Built-in light/dark theme support
- No runtime JavaScript needed (static HTML output)
- Wide language support

**Usage Pattern:**
```typescript
import { codeToHtml } from 'shiki';

const html = await codeToHtml(code, {
  lang: 'typescript',
  themes: {
    light: 'github-light',
    dark: 'github-dark'
  }
});
```

### Option 2: Highlight.js
Lightweight, easy-to-use alternative.

**Packages:** `highlight.js`

**Benefits:**
- Smaller bundle size
- Simple API
- Theme switching via CSS
- Auto language detection

**Usage:**
Import themes in component:
```svelte
<script>
  import 'highlight.js/styles/github.css'; // light theme
  import 'highlight.js/styles/github-dark.css'; // dark theme
</script>
```

### Option 3: Prism.js
Extensible with plugins, good for blogs.

**Packages:** `prismjs`

**Benefits:**
- Plugin ecosystem (line numbers, copy button, etc.)
- Language-specific loading (smaller bundles)
- Many themes available

### For Markdown Content
If blog articles are written in Markdown, use:

**MDsveX** (`mdsvex`): Markdown preprocessor for Svelte
- Allows Svelte components in markdown
- Integrates with rehype/remark ecosystem
- Pair with `rehype-shiki` or `rehype-highlight` for syntax highlighting

**Configuration:**
```javascript
// svelte.config.js
import { mdsvex } from 'mdsvex';
import rehypeShiki from 'rehype-shiki';

const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    mdsvex({
      rehypePlugins: [
        [rehypeShiki, {
          themes: { light: 'github-light', dark: 'github-dark' }
        }]
      ]
    }),
    vitePreprocess()
  ]
  // ...
};
```

### Recommendation
For this blog:
1. **Use Shiki** for syntax highlighting (best quality, theme-aware)
2. **Use MDsveX** if writing articles in Markdown
3. **Theme-aware code blocks:** Configure Shiki with dual themes that automatically switch with site theme
