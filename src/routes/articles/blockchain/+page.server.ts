export function load() {
	const articles = [
		{
			title: 'How does Pump.fun create a liquidity pool on Raydium?',
			description: 'A coding tour explaining how Pump.fun creates a liquidity pool on Raydium in an atomic and automated way.',
			slug: 'pumpfun-with-raydium',
			date: '2026-01-02',
			readTime: '15 min read',
			tags: ['Solana', 'DeFi', 'Raydium', 'Anchor']
		}
		// Add more blockchain articles here as you create them
	];

	return {
		articles
	};
}
