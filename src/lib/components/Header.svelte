<script lang="ts">
	let isArticlesOpen = $state(false);

	function toggleArticles() {
		isArticlesOpen = !isArticlesOpen;
	}

	function closeDropdown() {
		isArticlesOpen = false;
	}
</script>

<header class="header">
	<nav class="header-nav">
		<div class="header-content">
			<!-- Logo/Brand -->
			<div class="header-brand">
				<a href="/" class="brand-link">
					<span class="brand-text">PTBH</span>
					<span class="brand-separator">/</span>
					<span class="brand-subtitle">Blog</span>
				</a>
			</div>

			<!-- Navigation Links -->
			<div class="nav-links">
				<!-- Articles Dropdown -->
				<div class="nav-item-dropdown">
					<button onclick={toggleArticles} class="nav-button">
						<span>Articles</span>
						<svg
							class="nav-arrow {isArticlesOpen ? 'nav-arrow-open' : ''}"
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2 4L6 8L10 4"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>

					{#if isArticlesOpen}
						<div class="dropdown-menu">
							<div class="dropdown-content">
								<a href="/articles/blockchain" onclick={closeDropdown} class="dropdown-item">
									<div class="dropdown-item-icon">⛓️</div>
									<div class="dropdown-item-content">
										<div class="dropdown-item-title">Blockchain</div>
										<div class="dropdown-item-description">Smart contracts & DeFi</div>
									</div>
								</a>
								<a href="/articles/algorithm" onclick={closeDropdown} class="dropdown-item">
									<div class="dropdown-item-icon">🧮</div>
									<div class="dropdown-item-content">
										<div class="dropdown-item-title">Algorithm</div>
										<div class="dropdown-item-description">Data structures & problem solving</div>
									</div>
								</a>
								<a href="/articles/software" onclick={closeDropdown} class="dropdown-item">
									<div class="dropdown-item-icon">💻</div>
									<div class="dropdown-item-content">
										<div class="dropdown-item-title">Software</div>
										<div class="dropdown-item-description">Engineering & architecture</div>
									</div>
								</a>
							</div>
						</div>
					{/if}
				</div>

				<!-- Tools -->
				<a href="/tools" class="nav-link">
					<span>Tools</span>
				</a>

				<!-- About Me -->
				<a href="/about" class="nav-link">
					<span>About</span>
				</a>
			</div>
		</div>
	</nav>
</header>

<!-- Overlay to close dropdown when clicking outside -->
{#if isArticlesOpen}
	<div class="dropdown-overlay" onclick={closeDropdown} role="button" tabindex="-1" aria-label="Close dropdown"></div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@500;600;700&display=swap');

	/* Header Container */
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98));
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgb(226, 232, 240);
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
	}

	.header-nav {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 5rem;
	}

	/* Brand */
	.header-brand {
		flex-shrink: 0;
	}

	.brand-link {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		text-decoration: none;
		transition: transform 0.2s ease;
	}

	.brand-link:hover {
		transform: translateY(-1px);
	}

	.brand-text {
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		font-weight: 800;
		background: linear-gradient(135deg, rgb(126, 34, 206), rgb(88, 28, 135));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
	}

	.brand-separator {
		font-family: 'Inter', sans-serif;
		font-size: 1.5rem;
		font-weight: 300;
		color: rgb(203, 213, 225);
	}

	.brand-subtitle {
		font-family: 'Inter', sans-serif;
		font-size: 1.125rem;
		font-weight: 600;
		color: rgb(71, 85, 105);
	}

	/* Navigation Links */
	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.nav-link {
		position: relative;
		padding: 0.75rem 1.25rem;
		font-family: 'Inter', sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		color: rgb(71, 85, 105);
		text-decoration: none;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.nav-link:hover {
		color: rgb(126, 34, 206);
		background-color: rgb(250, 245, 255);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0.5rem;
		left: 50%;
		transform: translateX(-50%) scaleX(0);
		width: 50%;
		height: 2px;
		background: linear-gradient(90deg, rgb(126, 34, 206), rgb(168, 85, 247));
		border-radius: 2px;
		transition: transform 0.2s ease;
	}

	.nav-link:hover::after {
		transform: translateX(-50%) scaleX(1);
	}

	/* Dropdown */
	.nav-item-dropdown {
		position: relative;
	}

	.nav-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		font-family: 'Inter', sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		color: rgb(71, 85, 105);
		background: none;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.nav-button:hover {
		color: rgb(126, 34, 206);
		background-color: rgb(250, 245, 255);
	}

	.nav-arrow {
		transition: transform 0.3s ease;
		color: currentColor;
	}

	.nav-arrow-open {
		transform: rotate(180deg);
	}

	/* Dropdown Menu */
	.dropdown-menu {
		position: absolute;
		top: calc(100% + 0.75rem);
		left: 0;
		min-width: 20rem;
		background: white;
		border-radius: 0.75rem;
		border: 1px solid rgb(226, 232, 240);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		animation: dropdownSlide 0.2s ease-out;
	}

	@keyframes dropdownSlide {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.dropdown-content {
		padding: 0.5rem;
	}

	.dropdown-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
		text-decoration: none;
		transition: all 0.2s ease;
		border: 2px solid transparent;
	}

	.dropdown-item:hover {
		background: linear-gradient(135deg, rgb(250, 245, 255), rgb(252, 231, 243));
		border-color: rgb(233, 213, 255);
		transform: translateX(4px);
	}

	.dropdown-item-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	.dropdown-item:hover .dropdown-item-icon {
		transform: scale(1.1);
	}

	.dropdown-item-content {
		flex: 1;
	}

	.dropdown-item-title {
		font-family: 'Inter', sans-serif;
		font-size: 0.9375rem;
		font-weight: 700;
		color: rgb(15, 23, 42);
		margin-bottom: 0.25rem;
	}

	.dropdown-item:hover .dropdown-item-title {
		color: rgb(126, 34, 206);
	}

	.dropdown-item-description {
		font-family: 'Inter', sans-serif;
		font-size: 0.8125rem;
		color: rgb(100, 116, 139);
		line-height: 1.4;
	}

	/* Overlay */
	.dropdown-overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.header-content {
			height: 4rem;
		}

		.brand-text {
			font-size: 1.5rem;
		}

		.brand-subtitle {
			font-size: 1rem;
		}

		.nav-links {
			gap: 0.25rem;
		}

		.nav-link,
		.nav-button {
			padding: 0.5rem 0.75rem;
			font-size: 0.875rem;
		}

		.dropdown-menu {
			min-width: 16rem;
		}

		.dropdown-item {
			padding: 0.75rem;
		}
	}
</style>
