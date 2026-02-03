<script lang="ts">
	import '$lib/styles/article.css';

	// CV Data Structure - Replace with your actual information
	const cv = {
		introduction: {
			name: 'Phuc Ta',
			title: 'Senior Blockchain Developer',
			location: 'HaNoi, VietNam',
			email: 'hoangphunb97@gmail.com',
			phone: '+(84) 388196342',
			website: 'phuctbh.xyz',
			linkedin: 'www.linkedin.com/in/ta-phuc-437a12185/',
			github: 'github.com/anhoangphuc',
			summary:
				'Software engineer with 7 years of experience, specializing in blockchain development for the past 5 years' +
				' proven expertise in smart contract development, blockchain architecture and backend services across multiple projects on EVM-based chains and Solana' +
				', delivering secure and scalable decentralized solutions.'
		},
		careerHighlights: [
			'3+ years of technical leadership experience, managing cross-functional teams of 3-6 developers to deliver blockchain solutions',
			'Architected and deployed multiple production-grade smart contract systems on EVM-based chains and Solana using Solidity and Rust',
			'4+ years as a backend engineer specializing in blockchain indexers and integration services, with deep expertise in TypeScript'
		],
		techStack: {
			blockchain: ['EVM-based chain', 'Solana', 'Bitcoin', 'Hardhat', 'Foundry', 'Anchor'],
			languages: ['JavaScript', 'TypeScript', 'Solidity', 'Rust', 'Python'],
			backend: ['Node.js', 'NestJs', 'Actix', 'Django', 'Redis'],
			databases: ['PostgreSQL', 'MongoDB', 'Redis']
		},
		workExperience: [
			{
				company: 'Calber Venture',
				position: 'Senior Blockchain Engineer',
				location: 'Ha Noi, Vietnam; Remote',
				period: 'January 2025 - Present',
				description:
					'Developed and maintained non-custodial BTC solutions for swapping and lending.',
				achievements: [
					'Built cross-chain trading platform connecting Bitcoin with Ethereum and Solana, achieving $5M+ trading volume',
					'Integrated Morpho protocol to create non-custodial lending market for USDC-collateralized BTC loans',
					'Integrated Across bridge protocol to enable seamless asset transfers from Bitcoin to BSC, Base, and Polygon'
				],
				technologies: ['Anchor', 'Foundry', 'Hardhat', 'Solidity', 'Rust', 'TypeScript']
			},
			{
				company: 'Remitano',
				logo: '🏢',
				position: 'Solana Blockchain Engineer',
				location: 'Remote',
				period: 'May 2024 - January 2025',
				description: 'Developed secure lending platform on Renec and Solana blockchains.',
				achievements: [
					'Developed and maintained RenecLend smart contracts, achieving $5M total value locked across Solana and Renec',
					'Engineered NFT management system with Merkle Root validation for mass airdrops, reducing costs by 2 SOL per 1,000 users',
					'Built backend infrastructure for Solana integration with HTTP endpoints for smart contract interaction and data retrieval'
				],
				technologies: ['Anchor', 'Rust', 'Node.js', 'PostgreSQL', 'TypeScript', 'Svelte']
			},
			{
				company: 'Sotatek',
				logo: '🚀',
				position: 'Lead Blockchain Engineer',
				location: 'Ha Noi, Vietnam',
				period: 'June 2021 - April 2024',
				description:
					'Led blockchain development for DeFi and NFT projects, managing teams and architecting scalable solutions.',
				achievements: [
					'Developed gas-optimized smart contracts for Buni (top 10 BSC project), including NFT minting, mystery boxes, and battle logic with on/off-chain bridge infrastructure',
					'Led team building NFT marketplace using Diamond pattern to bypass contract size limits, implementing signature-based orders to minimize transaction fees',
					'Built scalable blockchain indexer for Metaverse Starter launchpad with automated user ranking based on staking history',
					'Redesigned Wombat Exchange protocol for Solana compatibility, transforming stable swap AMM architecture',
					'Engineered web-based ERP system for manufacturing with real-time order management and worker tracking'
				],
				technologies: [
					'Solidity',
					'Rust',
					'TypeScript',
					'Node.js',
					'Actix-web',
					'NestJs',
					'Hardhat',
					'Anchor',
					'Foundry'
				]
			},
			{
				company: 'Viettel Digital Service',
				logo: '💡',
				position: 'Data Engineer',
				location: 'Ha Noi, Vietnam',
				period: 'December 2019 - May 2021',
				description:
					'Optimized enterprise data architecture and ETL workflows for large-scale analytics.',
				achievements: [
					'Optimized ETL workflows and data architecture, improving Appsflyer reporting performance 6x (60 to 10 minutes)',
					'Built data pipeline architecture with efficient ETL processes for enterprise business analytics',
					'Designed department-wide messaging system with automated notifications across SMS, email, and Telegram'
				],
				technologies: ['Python', 'Scala', 'Oracle', 'PostgreSQL', 'Spark', 'Hadoop']
			}
		]
	};
</script>

<svelte:head>
	<title>{cv.introduction.name} - CV</title>
	<meta name="description" content="Professional CV and resume of {cv.introduction.name}" />
</svelte:head>

<div class="cv-page">
	<div class="cv-container">
		<!-- Header/Introduction Section -->
		<section class="cv-header">
			<h1 class="cv-name">{cv.introduction.name}</h1>
			<p class="cv-title">{cv.introduction.title}</p>
			<p class="cv-location">📍 {cv.introduction.location}</p>

			<!-- Contact Information -->
			<div class="cv-contact">
				<a href="mailto:{cv.introduction.email}">{cv.introduction.email}</a>
				<span class="separator">|</span>
				<a href="tel:{cv.introduction.phone}">{cv.introduction.phone}</a>
				<span class="separator">|</span>
				<a href="https://{cv.introduction.website}" target="_blank" rel="noopener noreferrer">
					🌐 {cv.introduction.website}
				</a>
				<span class="separator">|</span>
				<a href="https://{cv.introduction.linkedin}" target="_blank" rel="noopener noreferrer">
					💼 LinkedIn
				</a>
				<span class="separator">|</span>
				<a href="https://{cv.introduction.github}" target="_blank" rel="noopener noreferrer">
					💻 GitHub
				</a>
			</div>

			<!-- Summary -->
			<p class="cv-summary">{cv.introduction.summary}</p>
		</section>

		<!-- Career Highlights Section -->
		<section class="cv-section">
			<h2 class="cv-section-title">🌟 Career Highlights</h2>
			<div class="cv-section-content">
				<ul class="cv-list">
					{#each cv.careerHighlights as highlight}
						<li class="cv-list-item">
							<span class="bullet">✓</span>
							<span>{highlight}</span>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<!-- Tech Stack Section -->
		<section class="cv-section">
			<h2 class="cv-section-title">🛠️ Tech Stack</h2>
			<div class="cv-section-content">
				<div class="tech-stack-grid">
					<!-- Blockchain -->
					<div class="tech-category-box">
						<h3 class="tech-category-title">Blockchain</h3>
						<div class="tech-list-flex">
							{#each cv.techStack.blockchain as tech, index}
								<span class="tech-item">{tech}</span>
								{#if index < cv.techStack.blockchain.length - 1}
									<span class="tech-separator">,</span>
								{/if}
							{/each}
						</div>
					</div>

					<!-- Languages -->
					<div class="tech-category-box">
						<h3 class="tech-category-title">Languages</h3>
						<div class="tech-list-flex">
							{#each cv.techStack.languages as tech, index}
								<span class="tech-item">{tech}</span>
								{#if index < cv.techStack.languages.length - 1}
									<span class="tech-separator">,</span>
								{/if}
							{/each}
						</div>
					</div>

					<!-- Backend -->
					<div class="tech-category-box">
						<h3 class="tech-category-title">Backend</h3>
						<div class="tech-list-flex">
							{#each cv.techStack.backend as tech, index}
								<span class="tech-item">{tech}</span>
								{#if index < cv.techStack.backend.length - 1}
									<span class="tech-separator">,</span>
								{/if}
							{/each}
						</div>
					</div>

					<!-- Databases -->
					<div class="tech-category-box">
						<h3 class="tech-category-title">️Databases</h3>
						<div class="tech-list-flex">
							{#each cv.techStack.databases as tech, index}
								<span class="tech-item">{tech}</span>
								{#if index < cv.techStack.databases.length - 1}
									<span class="tech-separator">,</span>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Work Experience Section -->
		<section class="cv-section">
			<h2 class="cv-section-title">💼 Work Experience</h2>
			<div class="cv-section-content">
				{#each cv.workExperience as job, index}
					<div class="work-item">
						<!-- Company Header -->
						<div class="work-header">
							<div class="work-company-info">
								<h3 class="work-company">{job.company}</h3>
								<p class="work-position">{job.position}</p>
								<div class="work-meta">
									<span>📍 {job.location}</span>
									<span class="separator">•</span>
									<span>📅 {job.period}</span>
								</div>
							</div>
						</div>

						<!-- Description -->
						<p class="work-description">{job.description}</p>

						<!-- Key Achievements -->
						<div class="work-achievements">
							<ul class="cv-list">
								{#each job.achievements as achievement}
									<li class="cv-list-item">
										<span class="bullet">•</span>
										<span>{achievement}</span>
									</li>
								{/each}
							</ul>
						</div>

						<!-- Technologies Used -->
						<div class="work-technologies">
							<span class="tech-label">Technologies:</span>
							<span class="tech-items">{job.technologies.join(', ')}</span>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.cv-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #faf5ff 100%);
		padding: 3rem 1.5rem;
		font-family: 'Inter', sans-serif;
	}

	:global(.dark) .cv-page {
		background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
	}

	.cv-container {
		max-width: 900px;
		margin: 0 auto;
		background: white;
		padding: 3rem;
		border-radius: 1rem;
		box-shadow: 0 8px 32px rgba(126, 34, 206, 0.12);
	}

	:global(.dark) .cv-container {
		background: #1e293b;
		box-shadow: 0 8px 32px rgba(168, 85, 247, 0.2);
	}

	/* Header Section */
	.cv-header {
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 2px solid rgb(216, 180, 254);
	}

	:global(.dark) .cv-header {
		border-bottom-color: rgb(126, 34, 206);
	}

	.cv-name {
		font-family: 'Playfair Display', serif;
		font-size: 3rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}

	:global(.dark) .cv-name {
		color: #f8fafc;
	}

	.cv-title {
		font-size: 1.5rem;
		font-weight: 500;
		color: #475569;
		margin-bottom: 0.5rem;
	}

	:global(.dark) .cv-title {
		color: #cbd5e1;
	}

	.cv-location {
		font-size: 1rem;
		color: #64748b;
		margin-bottom: 1.5rem;
	}

	:global(.dark) .cv-location {
		color: #94a3b8;
	}

	.cv-contact {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
		color: #475569;
	}

	:global(.dark) .cv-contact {
		color: #cbd5e1;
	}

	.cv-contact a {
		color: inherit;
		text-decoration: none;
		transition: color 0.2s;
	}

	.cv-contact a:hover {
		color: rgb(126, 34, 206);
	}

	:global(.dark) .cv-contact a:hover {
		color: rgb(168, 85, 247);
	}

	.separator {
		color: #cbd5e1;
	}

	:global(.dark) .separator {
		color: #475569;
	}

	.cv-summary {
		font-size: 1rem;
		line-height: 1.7;
		color: #334155;
	}

	:global(.dark) .cv-summary {
		color: #cbd5e1;
	}

	/* Section Styles */
	.cv-section {
		margin-bottom: 2rem;
		padding: 2rem;
		background: #f8fafc;
		border: 2px solid rgb(216, 180, 254);
		border-radius: 0.5rem;
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}

	.cv-section:hover {
		border-color: rgb(192, 132, 252);
		box-shadow: 0 4px 12px rgba(126, 34, 206, 0.1);
	}

	:global(.dark) .cv-section {
		background: #0f172a;
		border-color: rgb(126, 34, 206);
	}

	:global(.dark) .cv-section:hover {
		border-color: rgb(168, 85, 247);
		box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
	}

	.cv-section-title {
		font-family: 'Playfair Display', serif;
		font-size: 2rem;
		font-weight: 700;
		color: rgb(126, 34, 206);
		margin-bottom: 1.5rem;
	}

	:global(.dark) .cv-section-title {
		color: rgb(216, 180, 254);
	}

	.cv-section-content {
		padding-left: 0;
	}

	/* Lists */
	.cv-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.cv-list-item {
		display: flex;
		gap: 1rem;
		margin-bottom: 0.75rem;
		line-height: 1.6;
		color: #334155;
	}

	:global(.dark) .cv-list-item {
		color: #cbd5e1;
	}

	.bullet {
		flex-shrink: 0;
		color: #64748b;
		font-weight: 600;
	}

	:global(.dark) .bullet {
		color: #94a3b8;
	}

	/* Tech Stack */
	.tech-stack-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.tech-stack-grid {
			grid-template-columns: 1fr;
		}
	}

	.tech-category-box {
		padding: 1.25rem;
		background: linear-gradient(135deg, #faf5ff, #f5f3ff);
		border: 1px solid rgb(233, 213, 255);
		border-radius: 0.375rem;
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}

	.tech-category-box:hover {
		border-color: rgb(216, 180, 254);
		box-shadow: 0 2px 8px rgba(126, 34, 206, 0.1);
	}

	:global(.dark) .tech-category-box {
		background: linear-gradient(135deg, #1e1b4b, #1e293b);
		border-color: rgb(88, 28, 135);
	}

	:global(.dark) .tech-category-box:hover {
		border-color: rgb(126, 34, 206);
		box-shadow: 0 2px 8px rgba(168, 85, 247, 0.2);
	}

	.tech-category-title {
		font-size: 1rem;
		font-weight: 600;
		color: rgb(109, 40, 217);
		margin-bottom: 0.75rem;
	}

	:global(.dark) .tech-category-title {
		color: rgb(216, 180, 254);
	}

	.tech-list-flex {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: #475569;
	}

	:global(.dark) .tech-list-flex {
		color: #94a3b8;
	}

	.tech-item {
		white-space: nowrap;
	}

	.tech-separator {
		margin-right: 0.25rem;
	}

	/* Work Experience */
	.work-item {
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #faf5ff, #f5f3ff);
		border: 2px solid rgb(233, 213, 255);
		border-radius: 0.5rem;
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}

	.work-item:hover {
		border-color: rgb(216, 180, 254);
		box-shadow: 0 4px 12px rgba(126, 34, 206, 0.15);
	}

	:global(.dark) .work-item {
		background: linear-gradient(135deg, #1e1b4b, #1e293b);
		border-color: rgb(88, 28, 135);
	}

	:global(.dark) .work-item:hover {
		border-color: rgb(126, 34, 206);
		box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
	}

	.work-item:last-child {
		margin-bottom: 0;
	}

	.work-header {
		margin-bottom: 1rem;
	}

	.work-company {
		font-size: 1.5rem;
		font-weight: 700;
		color: rgb(109, 40, 217);
		margin-bottom: 0.25rem;
	}

	:global(.dark) .work-company {
		color: rgb(216, 180, 254);
	}

	.work-position {
		font-size: 1.125rem;
		font-weight: 600;
		color: #475569;
		margin-bottom: 0.5rem;
	}

	:global(.dark) .work-position {
		color: #cbd5e1;
	}

	.work-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #64748b;
	}

	:global(.dark) .work-meta {
		color: #94a3b8;
	}

	.work-description {
		font-size: 1rem;
		line-height: 1.6;
		color: #475569;
		margin-bottom: 1rem;
	}

	:global(.dark) .work-description {
		color: #cbd5e1;
	}

	.work-achievements {
		margin-bottom: 1rem;
	}

	.work-technologies {
		font-size: 0.875rem;
		color: #475569;
		line-height: 1.6;
	}

	:global(.dark) .work-technologies {
		color: #94a3b8;
	}

	.tech-label {
		font-weight: 600;
		color: #334155;
		margin-right: 0.5rem;
	}

	:global(.dark) .tech-label {
		color: #cbd5e1;
	}

	.tech-items {
		color: #64748b;
	}

	:global(.dark) .tech-items {
		color: #94a3b8;
	}

	/* Footer */
	.cv-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 2px solid rgb(216, 180, 254);
		text-align: center;
	}

	:global(.dark) .cv-footer {
		border-top-color: rgb(126, 34, 206);
	}

	.download-button {
		padding: 0.75rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		background: linear-gradient(135deg, rgb(126, 34, 206), rgb(168, 85, 247));
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.download-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(126, 34, 206, 0.4);
	}

	:global(.dark) .download-button {
		background: linear-gradient(135deg, rgb(168, 85, 247), rgb(192, 132, 252));
	}

	:global(.dark) .download-button:hover {
		box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.cv-page {
			padding: 1.5rem 1rem;
		}

		.cv-container {
			padding: 2rem 1.5rem;
		}

		.cv-name {
			font-size: 2rem;
		}

		.cv-title {
			font-size: 1.25rem;
		}

		.cv-contact {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.separator {
			display: none;
		}

		.cv-section {
			padding: 1.5rem;
		}

		.cv-section-title {
			font-size: 1.5rem;
		}
	}
</style>
