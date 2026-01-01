export function load() {
	const rustCode = `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("PumpFun1111111111111111111111111111111111");

#[program]
pub mod pump_fun {
    use super::*;

    /// Buy tokens from the bonding curve
    pub fn buy(ctx: Context<Buy>, amount: u64) -> Result<()> {
        let bonding_curve = &mut ctx.accounts.bonding_curve;

        // Calculate price based on bonding curve formula
        let price = calculate_price(
            bonding_curve.current_supply,
            amount,
            bonding_curve.curve_type
        )?;

        // Transfer SOL from buyer to curve
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: bonding_curve.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, price)?;

        // Mint tokens to buyer
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: bonding_curve.to_account_info(),
        };
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                &[&[b"bonding-curve", &[bonding_curve.bump]]],
            ),
            amount,
        )?;

        // Update bonding curve state
        bonding_curve.current_supply += amount;
        bonding_curve.sol_reserves += price;

        // Check if graduation threshold reached
        if bonding_curve.should_graduate() {
            graduate_to_raydium(ctx, bonding_curve)?;
        }

        Ok(())
    }
}

/// Calculate token price using bonding curve formula
fn calculate_price(supply: u64, amount: u64, curve_type: CurveType) -> Result<u64> {
    match curve_type {
        CurveType::Linear => {
            // Price = base_price + (supply * slope)
            Ok(amount * (1000 + supply / 1_000_000))
        }
        CurveType::Exponential => {
            // Exponential curve for faster price appreciation
            Ok(amount * (supply / 100_000).pow(2))
        }
    }
}

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"bonding-curve", token_mint.key().as_ref()],
        bump = bonding_curve.bump,
    )]
    pub bonding_curve: Account<'info, BondingCurve>,

    #[account(mut)]
    pub token_mint: Account<'info, token::Mint>,

    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BondingCurve {
    pub bump: u8,
    pub current_supply: u64,
    pub sol_reserves: u64,
    pub curve_type: CurveType,
    pub graduation_threshold: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub enum CurveType {
    Linear,
    Exponential,
}`;

	return {
		rustCode
	};
}
