use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

pub mod errors;
pub mod state;

use errors::*;
use state::*;

declare_id!("CuRvE11111111111111111111111111111111111111");

/// Constants
pub const CREATOR_FEE_BPS: u128 = 300; // 3%
pub const PLATFORM_FEE_BPS: u128 = 200; // 2%
pub const REFERRAL_FEE_BPS: u128 = 100; // 1%
pub const RESERVE_BPS: u128 = 9400; // 94%
pub const BPS_DENOMINATOR: u128 = 10000;

pub const LOCK_PERIOD_SECONDS: i64 = 604800; // 7 days
pub const MAX_PURCHASE_DEFAULT: u64 = 100;
pub const CREATOR_MIN_BUY_PROFILE: u64 = 10;

#[program]
pub mod launchos_curve {
    use super::*;

    /// Initialize the curve program configuration
    pub fn initialize(ctx: Context<Initialize>, platform_treasury: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.platform_treasury = platform_treasury;
        config.max_purchase = MAX_PURCHASE_DEFAULT;
        config.creator_min_buy = CREATOR_MIN_BUY_PROFILE;
        config.lock_period = LOCK_PERIOD_SECONDS;
        config.paused = false;
        config.bump = ctx.bumps.config;

        msg!("Curve program initialized");
        msg!("Platform treasury: {}", platform_treasury);
        Ok(())
    }

    /// Initialize ban list
    pub fn initialize_ban_list(ctx: Context<InitializeBanList>) -> Result<()> {
        let ban_list = &mut ctx.accounts.ban_list;
        ban_list.authority = ctx.accounts.authority.key();
        ban_list.banned_accounts = Vec::new();
        ban_list.bump = ctx.bumps.ban_list;

        msg!("Ban list initialized");
        Ok(())
    }

    /// STEP 1: Create a new bonding curve (PENDING status, hidden from public)
    /// SECURITY: This is the first step of the anti-sniper system
    pub fn create_curve(
        ctx: Context<CreateCurve>,
        twitter_handle: String,
        curve_type: CurveType,
    ) -> Result<()> {
        // SECURITY: Input validation
        require!(
            twitter_handle.len() > 0 && twitter_handle.len() <= 32,
            CurveError::InvalidAmount
        );

        // SECURITY: Check if creator is banned
        require!(
            !ctx.accounts.ban_list.is_banned(&ctx.accounts.creator.key()),
            CurveError::AccountBanned
        );

        // SECURITY: Check global pause
        require!(!ctx.accounts.config.paused, CurveError::CurvePaused);

        let curve = &mut ctx.accounts.curve;
        let clock = Clock::get()?;

        curve.creator = ctx.accounts.creator.key();
        curve.twitter_handle = twitter_handle.clone();
        curve.curve_type = curve_type;
        curve.status = CurveStatus::Pending; // 🔒 HIDDEN FROM PUBLIC
        curve.supply = 0;
        curve.reserve_balance = 0;
        curve.creator_fees_collected = 0;
        curve.created_at = clock.unix_timestamp;
        curve.activated_at = 0;
        curve.creator_unlock_time = 0;
        curve.reserve_bump = ctx.bumps.reserve_vault;
        curve.bump = ctx.bumps.curve;
        curve.reentrancy_guard = false;
        curve.total_buys = 0;
        curve.total_sells = 0;
        curve.platform_treasury = ctx.accounts.config.platform_treasury;

        msg!("Curve created (PENDING): {}", twitter_handle);
        msg!("Status: Hidden from public - waiting for creator buy");
        Ok(())
    }

    /// STEP 2: Creator's initial buy (must buy minimum keys)
    /// SECURITY: Keys are locked for 7 days, curve still PENDING
    pub fn creator_initial_buy(
        ctx: Context<CreatorInitialBuy>,
        amount: u64,
    ) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let config = &ctx.accounts.config;

        // SECURITY: Reentrancy check
        require!(curve.check_reentrancy(), CurveError::ReentrancyDetected);
        curve.set_reentrancy(true);

        // SECURITY: Verify this is the creator
        require!(
            curve.creator == ctx.accounts.buyer.key(),
            CurveError::Unauthorized
        );

        // SECURITY: Check curve is in PENDING status
        require!(
            curve.status == CurveStatus::Pending,
            CurveError::InvalidStatusTransition
        );

        // SECURITY: Input validation - must buy minimum
        require!(
            amount >= config.creator_min_buy,
            CurveError::CreatorMinNotMet
        );

        // SECURITY: Input validation - amount range
        curve.validate_amount(amount, config.max_purchase)?;

        // Calculate price using checked arithmetic
        let total_cost = curve.calculate_buy_price(amount)?;

        // Split fees (instant routing, no escrow)
        let reserve_amount = total_cost
            .checked_mul(RESERVE_BPS)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(CurveError::ArithmeticOverflow)?;

        let creator_fee = total_cost
            .checked_mul(CREATOR_FEE_BPS)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(CurveError::ArithmeticOverflow)?;

        let platform_fee = total_cost
            .checked_mul(PLATFORM_FEE_BPS)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // 1. UPDATE STATE FIRST (commit before calls)
        curve.supply = curve
            .supply
            .checked_add(amount as u128)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.reserve_balance = curve
            .reserve_balance
            .checked_add(reserve_amount)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.creator_fees_collected = curve
            .creator_fees_collected
            .checked_add(creator_fee)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.total_buys = curve
            .total_buys
            .checked_add(1)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // Set lock time (7 days from now)
        let clock = Clock::get()?;
        curve.creator_unlock_time = clock
            .unix_timestamp
            .checked_add(config.lock_period)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // Create key holder account
        let holder = &mut ctx.accounts.key_holder;
        holder.owner = ctx.accounts.buyer.key();
        holder.curve = curve.key();
        holder.amount = amount;
        holder.acquired_at = clock.unix_timestamp;
        holder.is_creator = true; // 🔒 Subject to lock
        holder.bump = ctx.bumps.key_holder;

        // 2. THEN DO EXTERNAL CALLS (transfers)
        // Transfer to reserve vault
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.reserve_vault.to_account_info(),
                },
            ),
            reserve_amount as u64,
        )?;

        // Transfer creator fee to creator (instant)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.creator.to_account_info(),
                },
            ),
            creator_fee as u64,
        )?;

        // Transfer platform fee (instant)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.platform_treasury.to_account_info(),
                },
            ),
            platform_fee as u64,
        )?;

        // 3. CLEAR REENTRANCY GUARD
        curve.set_reentrancy(false);

        msg!("Creator bought {} keys", amount);
        msg!("Keys locked until: {}", curve.creator_unlock_time);
        msg!("Curve still PENDING (hidden)");
        Ok(())
    }

    /// STEP 3: Activate the curve (make it public for trading)
    /// SECURITY: Only creator can activate, must have done initial buy
    pub fn activate_curve(ctx: Context<ActivateCurve>) -> Result<()> {
        let curve = &mut ctx.accounts.curve;

        // SECURITY: Only creator can activate
        require!(
            curve.creator == ctx.accounts.creator.key(),
            CurveError::Unauthorized
        );

        // SECURITY: Check current status
        require!(
            curve.status == CurveStatus::Pending,
            CurveError::InvalidStatusTransition
        );

        // SECURITY: Verify creator has bought minimum keys
        require!(
            curve.supply > 0,
            CurveError::CreatorMinNotMet
        );

        // Update status to ACTIVE (now public!)
        curve.status = CurveStatus::Active;
        let clock = Clock::get()?;
        curve.activated_at = clock.unix_timestamp;

        msg!("🚀 Curve ACTIVATED - Now public for trading!");
        msg!("Initial supply: {}", curve.supply);
        msg!("Creator keys locked until: {}", curve.creator_unlock_time);
        Ok(())
    }

    /// Buy keys (for regular users after curve is ACTIVE)
    pub fn buy_keys(
        ctx: Context<BuyKeys>,
        amount: u64,
        referrer: Option<Pubkey>,
    ) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let config = &ctx.accounts.config;

        // SECURITY: Reentrancy check
        require!(curve.check_reentrancy(), CurveError::ReentrancyDetected);
        curve.set_reentrancy(true);

        // SECURITY: Check curve is ACTIVE
        require!(
            curve.status == CurveStatus::Active,
            CurveError::CurveNotActive
        );

        // SECURITY: Check buyer is not banned
        require!(
            !ctx.accounts.ban_list.is_banned(&ctx.accounts.buyer.key()),
            CurveError::AccountBanned
        );

        // SECURITY: Global pause check
        require!(!config.paused, CurveError::CurvePaused);

        // SECURITY: Input validation
        curve.validate_amount(amount, config.max_purchase)?;

        // Calculate price
        let total_cost = curve.calculate_buy_price(amount)?;

        // Split fees
        let reserve_amount = total_cost
            .checked_mul(RESERVE_BPS)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(CurveError::ArithmeticOverflow)?;

        let creator_fee = total_cost
            .checked_mul(CREATOR_FEE_BPS)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(CurveError::ArithmeticOverflow)?;

        let platform_fee = total_cost
            .checked_mul(PLATFORM_FEE_BPS)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(CurveError::ArithmeticOverflow)?;

        let referral_fee = if referrer.is_some() {
            total_cost
                .checked_mul(REFERRAL_FEE_BPS)
                .ok_or(CurveError::ArithmeticOverflow)?
                .checked_div(BPS_DENOMINATOR)
                .ok_or(CurveError::ArithmeticOverflow)?
        } else {
            0
        };

        // 1. UPDATE STATE FIRST
        curve.supply = curve
            .supply
            .checked_add(amount as u128)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.reserve_balance = curve
            .reserve_balance
            .checked_add(reserve_amount)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.creator_fees_collected = curve
            .creator_fees_collected
            .checked_add(creator_fee)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.total_buys = curve
            .total_buys
            .checked_add(1)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // Update or create key holder
        let holder = &mut ctx.accounts.key_holder;
        if holder.amount == 0 {
            // New holder
            let clock = Clock::get()?;
            holder.owner = ctx.accounts.buyer.key();
            holder.curve = curve.key();
            holder.amount = amount;
            holder.acquired_at = clock.unix_timestamp;
            holder.is_creator = false;
            holder.bump = ctx.bumps.key_holder;
        } else {
            // Existing holder
            holder.amount = holder
                .amount
                .checked_add(amount)
                .ok_or(CurveError::ArithmeticOverflow)?;
        }

        // 2. THEN DO EXTERNAL CALLS
        // Transfer to reserve
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.reserve_vault.to_account_info(),
                },
            ),
            reserve_amount as u64,
        )?;

        // Transfer creator fee (instant)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.creator.to_account_info(),
                },
            ),
            creator_fee as u64,
        )?;

        // Transfer platform fee (instant)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.platform_treasury.to_account_info(),
                },
            ),
            platform_fee as u64,
        )?;

        // Transfer referral fee if applicable
        if let Some(referrer_pubkey) = referrer {
            if referral_fee > 0 {
                anchor_lang::system_program::transfer(
                    CpiContext::new(
                        ctx.accounts.system_program.to_account_info(),
                        anchor_lang::system_program::Transfer {
                            from: ctx.accounts.buyer.to_account_info(),
                            to: ctx.accounts.referrer.as_ref().unwrap().to_account_info(),
                        },
                    ),
                    referral_fee as u64,
                )?;
            }
        }

        // 3. CLEAR REENTRANCY GUARD
        curve.set_reentrancy(false);

        msg!("Keys purchased: {}", amount);
        msg!("Total cost: {} lamports", total_cost);
        Ok(())
    }

    /// Sell keys
    pub fn sell_keys(ctx: Context<SellKeys>, amount: u64) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let holder = &mut ctx.accounts.key_holder;
        let config = &ctx.accounts.config;

        // SECURITY: Reentrancy check
        require!(curve.check_reentrancy(), CurveError::ReentrancyDetected);
        curve.set_reentrancy(true);

        // SECURITY: Check curve is ACTIVE
        require!(
            curve.status == CurveStatus::Active,
            CurveError::CurveNotActive
        );

        // SECURITY: Check seller is not banned
        require!(
            !ctx.accounts.ban_list.is_banned(&ctx.accounts.seller.key()),
            CurveError::AccountBanned
        );

        // SECURITY: Global pause check
        require!(!config.paused, CurveError::CurvePaused);

        // SECURITY: Input validation
        require!(amount > 0, CurveError::InvalidAmount);
        require!(holder.amount >= amount, CurveError::InsufficientReserve);

        // SECURITY: Check if creator keys are locked
        if holder.is_creator {
            let clock = Clock::get()?;
            require!(
                !curve.are_keys_locked(clock.unix_timestamp),
                CurveError::KeysLocked
            );
        }

        // Calculate sell price (with 5% tax)
        let payout = curve.calculate_sell_price(amount)?;

        // SECURITY: Check reserve has enough balance
        require!(
            curve.reserve_balance >= payout,
            CurveError::InsufficientReserve
        );

        // 1. UPDATE STATE FIRST
        curve.supply = curve
            .supply
            .checked_sub(amount as u128)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.reserve_balance = curve
            .reserve_balance
            .checked_sub(payout)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.total_sells = curve
            .total_sells
            .checked_add(1)
            .ok_or(CurveError::ArithmeticOverflow)?;

        holder.amount = holder
            .amount
            .checked_sub(amount)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // 2. THEN DO EXTERNAL CALL (transfer from reserve to seller)
        let curve_key = curve.key();
        let seeds = &[
            b"reserve",
            curve_key.as_ref(),
            &[curve.reserve_bump],
        ];
        let signer = &[&seeds[..]];

        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: ctx.accounts.seller.to_account_info(),
                },
                signer,
            ),
            payout as u64,
        )?;

        // 3. CLEAR REENTRANCY GUARD
        curve.set_reentrancy(false);

        msg!("Keys sold: {}", amount);
        msg!("Payout: {} lamports (after 5% tax)", payout);
        Ok(())
    }

    /// Report a bot account (admin will review and ban)
    pub fn report_bot(ctx: Context<ReportBot>, reported_account: Pubkey) -> Result<()> {
        msg!("Bot report submitted for: {}", reported_account);
        msg!("Reporter: {}", ctx.accounts.reporter.key());
        // In production, emit an event that admin dashboard picks up
        Ok(())
    }

    /// Ban an account (admin only)
    pub fn ban_account(ctx: Context<BanAccount>, account_to_ban: Pubkey) -> Result<()> {
        let ban_list = &mut ctx.accounts.ban_list;

        // SECURITY: Only admin can ban
        require!(
            ban_list.authority == ctx.accounts.authority.key(),
            CurveError::Unauthorized
        );

        // Add to ban list if not already banned
        if !ban_list.is_banned(&account_to_ban) {
            ban_list.banned_accounts.push(account_to_ban);
            msg!("Account banned: {}", account_to_ban);
        }

        Ok(())
    }

    /// Emergency pause (admin only)
    pub fn pause(ctx: Context<AdminAction>) -> Result<()> {
        let config = &mut ctx.accounts.config;

        require!(
            config.authority == ctx.accounts.authority.key(),
            CurveError::Unauthorized
        );

        config.paused = true;
        msg!("🛑 Curve program PAUSED");
        Ok(())
    }

    /// Unpause (admin only)
    pub fn unpause(ctx: Context<AdminAction>) -> Result<()> {
        let config = &mut ctx.accounts.config;

        require!(
            config.authority == ctx.accounts.authority.key(),
            CurveError::Unauthorized
        );

        config.paused = false;
        msg!("✅ Curve program UNPAUSED");
        Ok(())
    }
}

// ============================================================================
// CONTEXT STRUCTS
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = CurveConfig::LEN,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, CurveConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeBanList<'info> {
    #[account(
        init,
        payer = authority,
        space = BanList::LEN,
        seeds = [b"ban_list"],
        bump
    )]
    pub ban_list: Account<'info, BanList>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(twitter_handle: String)]
pub struct CreateCurve<'info> {
    #[account(
        init,
        payer = creator,
        space = BondingCurve::LEN,
        seeds = [b"curve", twitter_handle.as_bytes()],
        bump
    )]
    pub curve: Account<'info, BondingCurve>,

    #[account(
        init,
        payer = creator,
        space = 8 + 0, // Empty PDA for reserve vault
        seeds = [b"reserve", curve.key().as_ref()],
        bump
    )]
    /// CHECK: Reserve vault PDA
    pub reserve_vault: AccountInfo<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, CurveConfig>,

    #[account(seeds = [b"ban_list"], bump)]
    pub ban_list: Account<'info, BanList>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatorInitialBuy<'info> {
    #[account(
        mut,
        seeds = [b"curve", curve.twitter_handle.as_bytes()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,

    #[account(
        mut,
        seeds = [b"reserve", curve.key().as_ref()],
        bump = curve.reserve_bump
    )]
    /// CHECK: Reserve vault PDA
    pub reserve_vault: AccountInfo<'info>,

    #[account(
        init,
        payer = buyer,
        space = KeyHolder::LEN,
        seeds = [b"holder", curve.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub key_holder: Account<'info, KeyHolder>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Creator wallet for fee distribution
    #[account(mut, address = curve.creator)]
    pub creator: AccountInfo<'info>,

    /// CHECK: Platform treasury for fee distribution
    #[account(mut, address = curve.platform_treasury)]
    pub platform_treasury: AccountInfo<'info>,

    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, CurveConfig>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ActivateCurve<'info> {
    #[account(
        mut,
        seeds = [b"curve", curve.twitter_handle.as_bytes()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,

    #[account(mut, address = curve.creator)]
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct BuyKeys<'info> {
    #[account(
        mut,
        seeds = [b"curve", curve.twitter_handle.as_bytes()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,

    #[account(
        mut,
        seeds = [b"reserve", curve.key().as_ref()],
        bump = curve.reserve_bump
    )]
    /// CHECK: Reserve vault PDA
    pub reserve_vault: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        space = KeyHolder::LEN,
        seeds = [b"holder", curve.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub key_holder: Account<'info, KeyHolder>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Creator wallet for fee distribution
    #[account(mut, address = curve.creator)]
    pub creator: AccountInfo<'info>,

    /// CHECK: Platform treasury for fee distribution
    #[account(mut, address = curve.platform_treasury)]
    pub platform_treasury: AccountInfo<'info>,

    /// CHECK: Optional referrer for fee distribution
    #[account(mut)]
    pub referrer: Option<AccountInfo<'info>>,

    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, CurveConfig>,

    #[account(seeds = [b"ban_list"], bump)]
    pub ban_list: Account<'info, BanList>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SellKeys<'info> {
    #[account(
        mut,
        seeds = [b"curve", curve.twitter_handle.as_bytes()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,

    #[account(
        mut,
        seeds = [b"reserve", curve.key().as_ref()],
        bump = curve.reserve_bump
    )]
    /// CHECK: Reserve vault PDA
    pub reserve_vault: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"holder", curve.key().as_ref(), seller.key().as_ref()],
        bump = key_holder.bump
    )]
    pub key_holder: Account<'info, KeyHolder>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, CurveConfig>,

    #[account(seeds = [b"ban_list"], bump)]
    pub ban_list: Account<'info, BanList>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReportBot<'info> {
    pub reporter: Signer<'info>,
}

#[derive(Accounts)]
pub struct BanAccount<'info> {
    #[account(mut, seeds = [b"ban_list"], bump = ban_list.bump)]
    pub ban_list: Account<'info, BanList>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, CurveConfig>,

    pub authority: Signer<'info>,
}
