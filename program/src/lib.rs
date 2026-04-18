use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
declare_id!("11111111111111111111111111111111");

pub const PLATFORM_FEE_BPS: u64 = 500;
pub const ESCROW_SEED: &[u8] = b"escrow";
pub const VAULT_SEED: &[u8] = b"vault";
#[program]
pub mod solana_freelance_escrow {
    use super::*;

    pub fn create_escrow(
        ctx: Context<CreateEscrow>,
        job_id: String,
        amount: u64,
        description: String,
    ) -> Result<()> {
        require!(amount > 0, EscrowError::InvalidAmount);
        let escrow = &mut ctx.accounts.escrow;
        escrow.job_id = job_id;
        escrow.client = ctx.accounts.client.key();
        escrow.freelancer = Pubkey::default();
        escrow.amount = amount;
        escrow.description = description;
        escrow.status = EscrowStatus::Open;
        escrow.bump = ctx.bumps.escrow;
        escrow.vault_bump = ctx.bumps.vault;
        escrow.created_at = Clock::get()?.unix_timestamp;
        escrow.platform_fee = (amount * PLATFORM_FEE_BPS) / 10_000;
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.client_usdc_account.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.client.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;
        Ok(())
    }
    pub fn accept_job(ctx: Context<AcceptJob>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::Open, EscrowError::InvalidStatus);
        escrow.freelancer = ctx.accounts.freelancer.key();
        escrow.status = EscrowStatus::InProgress;
        escrow.accepted_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::InProgress, EscrowError::InvalidStatus);
        require!(ctx.accounts.client.key() == escrow.client, EscrowError::Unauthorized);
        let platform_fee = escrow.platform_fee;
        let freelancer_amount = escrow.amount - platform_fee;
        let job_id_bytes = escrow.job_id.as_bytes().to_vec();
        let bump = escrow.bump;
        let seeds = &[ESCROW_SEED, job_id_bytes.as_slice(), &[bump]];
        let signer = &[&seeds[..]];
        let transfer_to_freelancer = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.freelancer_usdc_account.to_account_info(),
                authority: escrow.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_to_freelancer, freelancer_amount)?;
        let transfer_to_platform = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.platform_treasury.to_account_info(),
                authority: escrow.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_to_platform, platform_fee)?;
        escrow.status = EscrowStatus::Completed;
        escrow.completed_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
    pub fn cancel_escrow(ctx: Context<CancelEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(ctx.accounts.client.key() == escrow.client, EscrowError::Unauthorized);
        require!(escrow.status == EscrowStatus::Open, EscrowError::CannotCancel);
        let amount = escrow.amount;
        let job_id_bytes = escrow.job_id.as_bytes().to_vec();
        let bump = escrow.bump;
        let seeds = &[ESCROW_SEED, job_id_bytes.as_slice(), &[bump]];
        let signer = &[&seeds[..]];
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.client_usdc_account.to_account_info(),
                authority: escrow.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_ctx, amount)?;
        escrow.status = EscrowStatus::Cancelled;
        Ok(())
    }

    pub fn raise_dispute(ctx: Context<RaiseDispute>, reason: String) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::InProgress, EscrowError::InvalidStatus);
        require!(
            ctx.accounts.caller.key() == escrow.client || ctx.accounts.caller.key() == escrow.freelancer,
            EscrowError::Unauthorized
        );
        escrow.status = EscrowStatus::Disputed;
        escrow.dispute_reason = reason;
        Ok(())
    }
}
#[derive(Accounts)]
#[instruction(job_id: String)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(init, payer = client, space = Escrow::LEN, seeds = [ESCROW_SEED, job_id.as_bytes()], bump)]
    pub escrow: Account<'info, Escrow>,
    #[account(init, payer = client, token::mint = usdc_mint, token::authority = escrow, seeds = [VAULT_SEED, job_id.as_bytes()], bump)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub client_usdc_account: Account<'info, TokenAccount>,
    pub usdc_mint: Account<'info, anchor_spl::token::Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct AcceptJob<'info> {
    #[account(mut)]
    pub freelancer: Signer<'info>,
    #[account(mut, seeds = [ESCROW_SEED, escrow.job_id.as_bytes()], bump = escrow.bump)]
    pub escrow: Account<'info, Escrow>,
}

#[derive(Accounts)]
pub struct ReleaseFunds<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(mut, seeds = [ESCROW_SEED, escrow.job_id.as_bytes()], bump = escrow.bump)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut, seeds = [VAULT_SEED, escrow.job_id.as_bytes()], bump = escrow.vault_bump)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub freelancer_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub platform_treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelEscrow<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(mut, seeds = [ESCROW_SEED, escrow.job_id.as_bytes()], bump = escrow.bump)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut, seeds = [VAULT_SEED, escrow.job_id.as_bytes()], bump = escrow.vault_bump)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub client_usdc_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RaiseDispute<'info> {
    #[account(mut)]
    pub caller: Signer<'info>,
    #[account(mut, seeds = [ESCROW_SEED, escrow.job_id.as_bytes()], bump = escrow.bump)]
    pub escrow: Account<'info, Escrow>,
}
#[account]
pub struct Escrow {
    pub job_id: String,
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub amount: u64,
    pub platform_fee: u64,
    pub description: String,
    pub status: EscrowStatus,
    pub bump: u8,
    pub vault_bump: u8,
    pub created_at: i64,
    pub accepted_at: i64,
    pub completed_at: i64,
    pub dispute_reason: String,
}

impl Escrow {
    pub const LEN: usize = 8 + 4 + 64 + 32 + 32 + 8 + 8 + 4 + 256 + 1 + 1 + 1 + 8 + 8 + 8 + 4 + 256;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EscrowStatus {
    Open,
    InProgress,
    Completed,
    Cancelled,
    Disputed,
}

#[error_code]
pub enum EscrowError {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Invalid escrow status for this operation")]
    InvalidStatus,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Cannot cancel: job is already in progress")]
    CannotCancel,
}
