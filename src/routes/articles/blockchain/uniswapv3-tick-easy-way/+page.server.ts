export function load() {
	const tickSpacingExample = `// Uniswap V3 Fee Tiers and Tick Spacing
const FEE_TIERS = {
	LOW: {
		fee: 500,      // 0.05%
		tickSpacing: 10
	},
	MEDIUM: {
		fee: 3000,     // 0.3%
		tickSpacing: 60
	},
	HIGH: {
		fee: 10000,    // 1%
		tickSpacing: 200
	}
};`;

	const tickMathExample = `// Tick to Price Conversion
function tickToPrice(tick: number): number {
	return Math.pow(1.0001, tick);
}

// Price to Tick Conversion
function priceToTick(price: number): number {
	return Math.floor(Math.log(price) / Math.log(1.0001));
}

// Examples
const tick = 0;
const price = tickToPrice(tick);  // 1.0 (price is 1:1)

const tick_10000 = 10000;
const price_10000 = tickToPrice(tick_10000);  // ≈2.7183 (price increased by ~171.8%)`;

	const rangeExample = `// Providing Liquidity in a Specific Range
interface LiquidityPosition {
	tickLower: number;    // Lower bound of price range
	tickUpper: number;    // Upper bound of price range
	liquidity: bigint;    // Amount of liquidity
}

// Example: Provide liquidity for ETH/USDC between $1,800 and $2,200
const position: LiquidityPosition = {
	tickLower: priceToTick(1800),   // ≈-276325
	tickUpper: priceToTick(2200),   // ≈-276110
	liquidity: 1000000000000000000n // 1 ETH worth of liquidity
};`;

	const concentratedLiquidityCode = `// Traditional AMM (Uniswap V2)
// Liquidity spread across entire price curve (0 to ∞)
const v2Liquidity = {
	range: "0 to ∞",
	capital_efficiency: "Low",
	fees_earned: "Diluted across all prices"
};

// Concentrated Liquidity (Uniswap V3)
// Liquidity concentrated in specific price range
const v3Liquidity = {
	range: "tickLower to tickUpper",
	capital_efficiency: "Up to 4000x higher",
	fees_earned: "Concentrated in active range"
};`;

	return {
		tickSpacingExample,
		tickMathExample,
		rangeExample,
		concentratedLiquidityCode
	};
}
