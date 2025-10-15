use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

pub mod state;
pub mod errors;

use state::*;
use errors::*;

declare_id!("5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc");

#[program]
pub mod launchos_escrow {
    use super::*;

    /// Initialize the master escrow account
    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.authority = authority;
        escrow.total_pools = 0;
        escrow.total_value_locked = 0;
        escrow.paused = false;
        escrow.bump = ctx.bumps.escrow;

        msg!("Escrow initialized with authority: {}", authority);
        Ok(())
    }

    /// Create a new escrow pool for a specific purpose
    pub fn create_pool(
        ctx: Context<CreatePool>,
        pool_id: String,
        pool_type: PoolType,
        owner_id: Option<String>,
        pool_token_account: Pubkey,
    ) -> Result<()> {
        require!(!ctx.accounts.escrow.paused, EscrowError::SystemPaused);
        require!(pool_id.len() <= 64, EscrowError::InvalidPoolId);

        let pool = &mut ctx.accounts.pool;
        pool.pool_id = pool_id.clone();
        pool.pool_type = pool_type.clone();
        pool.owner_id = owner_id;
        pool.balance = 0;
        pool.total_deposited = 0;
        pool.total_withdrawn = 0;
        pool.status = PoolStatus::Active;
        pool.created_at = Clock::get()?.unix_timestamp;
        pool.bump = ctx.bumps.pool;
        pool.pool_token_account = pool_token_account;

        // Increment total pools count
        let escrow = &mut ctx.accounts.escrow;
        escrow.total_pools = escrow.total_pools.checked_add(1).unwrap();

        msg!("Pool created: {} (type: {:?})", pool_id, pool_type);
        Ok(())
    }

    /// Deposit USDC into an escrow pool
    pub fn deposit(
        ctx: Context<Deposit>,
        amount: u64,
    ) -> Result<()> {
        require!(!ctx.accounts.escrow.paused, EscrowError::SystemPaused);
        require!(amount > 0, EscrowError::InvalidAmount);
        require!(
            ctx.accounts.pool.status == PoolStatus::Active,
            EscrowError::PoolNotActive
        );

        // Transfer USDC from user to pool's token account
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update pool balances
        let pool = &mut ctx.accounts.pool;
        pool.balance = pool.balance.checked_add(amount).unwrap();
        pool.total_deposited = pool.total_deposited.checked_add(amount).unwrap();

        // Update global TVL
        let escrow = &mut ctx.accounts.escrow;
        escrow.total_value_locked = escrow.total_value_locked.checked_add(amount).unwrap();

        msg!("Deposited {} to pool: {}", amount, pool.pool_id);
        Ok(())
    }

    /// Withdraw USDC from an escrow pool (requires authority)
    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
    ) -> Result<()> {
        require!(!ctx.accounts.escrow.paused, EscrowError::SystemPaused);
        require!(amount > 0, EscrowError::InvalidAmount);

        // Check pool status and balance before mutable borrow
        require!(
            ctx.accounts.pool.status == PoolStatus::Active,
            EscrowError::PoolNotActive
        );
        require!(
            ctx.accounts.pool.balance >= amount,
            EscrowError::InsufficientBalance
        );

        // Get pool info BEFORE mutable borrow
        let pool_id = ctx.accounts.pool.pool_id.clone();
        let pool_bump = ctx.accounts.pool.bump;
        let pool_account_info = ctx.accounts.pool.to_account_info();

        // Transfer USDC from pool to recipient
        let pool_seeds = &[
            b"pool",
            pool_id.as_bytes(),
            &[pool_bump],
        ];
        let signer = &[&pool_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: pool_account_info,
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        // Now create mutable borrow to update pool balances
        let pool = &mut ctx.accounts.pool;
        pool.balance = pool.balance.checked_sub(amount).unwrap();
        pool.total_withdrawn = pool.total_withdrawn.checked_add(amount).unwrap();

        // Update global TVL
        let escrow = &mut ctx.accounts.escrow;
        escrow.total_value_locked = escrow.total_value_locked.checked_sub(amount).unwrap();

        msg!("Withdrew {} from pool: {}", amount, pool_id);
        Ok(())
    }

    /// Close an escrow pool (requires all funds withdrawn)
    pub fn close_pool(ctx: Context<ClosePool>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        require!(pool.balance == 0, EscrowError::PoolNotEmpty);

        pool.status = PoolStatus::Closed;

        msg!("Pool closed: {}", pool.pool_id);
        Ok(())
    }

    /// Pause all escrow operations (emergency only)
    pub fn pause(ctx: Context<UpdateEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.paused = true;

        msg!("Escrow system PAUSED");
        Ok(())
    }

    /// Unpause escrow operations
    pub fn unpause(ctx: Context<UpdateEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.paused = false;

        msg!("Escrow system UNPAUSED");
        Ok(())
    }
}

// ============================================================================
// Instruction Contexts
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + EscrowAccount::INIT_SPACE,
        seeds = [b"escrow"],
        bump
    )]
    pub escrow: Account<'info, EscrowAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(pool_id: String)]
pub struct CreatePool<'info> {
    #[account(
        mut,
        seeds = [b"escrow"],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, EscrowAccount>,

    #[account(
        init,
        payer = payer,
        space = 8 + Pool::INIT_SPACE,
        seeds = [b"pool", pool_id.as_bytes()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"escrow"],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, EscrowAccount>,

    #[account(mut)]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"escrow"],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, EscrowAccount>,

    #[account(
        mut,
        seeds = [b"pool", pool.pool_id.as_bytes()],
        bump = pool.bump,
        has_one = pool_token_account
    )]
    pub pool: Account<'info, Pool>,

    /// CHECK: Authority validated by escrow account
    #[account(constraint = authority.key() == escrow.authority @ EscrowError::Unauthorized)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClosePool<'info> {
    #[account(
        seeds = [b"escrow"],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, EscrowAccount>,

    #[account(
        mut,
        seeds = [b"pool", pool.pool_id.as_bytes()],
        bump = pool.bump
    )]
    pub pool: Account<'info, Pool>,

    /// CHECK: Authority validated by escrow account
    #[account(constraint = authority.key() == escrow.authority @ EscrowError::Unauthorized)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow"],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, EscrowAccount>,

    /// CHECK: Authority validated by escrow account
    #[account(constraint = authority.key() == escrow.authority @ EscrowError::Unauthorized)]
    pub authority: Signer<'info>,
}
