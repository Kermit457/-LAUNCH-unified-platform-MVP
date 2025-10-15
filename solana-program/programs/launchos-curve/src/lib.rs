use anchor_lang::prelude::*;

pub mod errors;
pub mod events;
pub mod math;
pub mod state;

use errors::*;
use events::*;
use state::*;

declare_id!("CuRvE11111111111111111111111111111111111111");

/// Constants for the new V4 fee structure
pub const RESERVE_BPS: u128 = 9400;      // 94% to reserve
pub const INSTANT_BPS: u128 = 200;       // 2% instant (referrer OR creator)
pub const BUYBACK_BPS: u128 = 100;       // 1% buyback/burn
pub const COMMUNITY_BPS: u128 = 100;     // 1% community rewards
pub const PLATFORM_BPS: u128 = 200;      // 2% platform
pub const BPS_DENOMINATOR: u128 = 10000;

pub const LOCK_PERIOD_SECONDS: i64 = 604800; // 7 days
pub const MAX_PURCHASE_DEFAULT: u64 = 100;
pub const CREATOR_MIN_BUY_PROFILE: u64 = 10;
pub const TARGET_RESERVE_DEFAULT: u64 = 32_000_000_000; // 32 SOL in lamports

#[program]
pub mod launchos_curve {
    use super::*;

    /// Initialize the curve program configuration
    pub fn initialize(
        ctx: Context<Initialize>,
        platform_treasury: Pubkey,
        buyback_wallet: Pubkey,
        community_wallet: Pubkey,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.platform_treasury = platform_treasury;
        config.buyback_wallet = buyback_wallet;
        config.community_wallet = community_wallet;
        config.max_purchase = MAX_PURCHASE_DEFAULT;
        config.creator_min_buy = CREATOR_MIN_BUY_PROFILE;
        config.lock_period = LOCK_PERIOD_SECONDS;
        config.target_reserve_default = TARGET_RESERVE_DEFAULT;
        config.paused = false;
        config.bump = ctx.bumps.config;

        msg!("✅ Curve program initialized");
        msg!("Platform treasury: {}", platform_treasury);
        msg!("Buyback wallet: {}", buyback_wallet);
        msg!("Community wallet: {}", community_wallet);
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
        launch_ts: Option<i64>, // Optional time-based auto-freeze
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

        let curve = &mut ctx.accounts.curve;
        let config = &ctx.accounts.config;
        let clock = Clock::get()?;

        // Identity
        curve.creator = ctx.accounts.creator.key();
        curve.twitter_handle = twitter_handle.clone();
        curve.curve_type = curve_type;

        // State
        curve.status = CurveStatus::Pending; // 🔒 HIDDEN FROM PUBLIC
        curve.supply = 0;
        curve.reserve_balance = 0;
        curve.unique_holders = 0;

        // Timestamps
        curve.created_at = clock.unix_timestamp;
        curve.activated_at = 0;
        curve.creator_unlock_time = 0;

        // Freeze System (NEW)
        curve.launch_ts = launch_ts;
        curve.target_reserve = config.target_reserve_default;
        curve.freeze_ts = None;
        curve.freeze_trigger = None;
        curve.supply_at_freeze = 0;
        curve.reserve_at_freeze = 0;

        // Snapshot (NEW)
        curve.snapshot_root = None;

        // Launch (NEW)
        curve.token_mint = None;
        curve.lp_vault = None;
        curve.marketing_wallet = None;
        curve.utility_wallet = None;
        curve.launched_at = None;
        curve.initial_buy_amount = 0;
        curve.is_launching = false;

        // Fee Tracking
        curve.creator_fees_collected = 0;
        curve.rewards_fees_collected = 0;

        // Stats
        curve.total_buys = 0;
        curve.total_sells = 0;

        // Configuration
        curve.platform_treasury = config.platform_treasury;
        curve.buyback_wallet = config.buyback_wallet;
        curve.community_wallet = config.community_wallet;

        // Security
        curve.reentrancy_guard = false;

        // PDA Bumps
        curve.reserve_bump = ctx.bumps.reserve_vault;
        curve.bump = ctx.bumps.curve;

        msg!("✅ Curve created (PENDING): {}", twitter_handle);
        msg!("Target reserve: {} SOL", curve.target_reserve / 1_000_000_000);
        if let Some(ts) = launch_ts {
            msg!("Time-based freeze set for: {}", ts);
        }
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

        // Calculate price using NEW hybrid exponential formula
        let total_cost = curve.calculate_buy_price(amount)?;

        // Calculate fees using V4 structure
        let fees = math::calculate_buy_fees(total_cost)?;

        // 1. UPDATE STATE FIRST (CEI pattern)
        curve.supply = curve
            .supply
            .checked_add(amount as u128)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.reserve_balance = curve
            .reserve_balance
            .checked_add(fees.reserve)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.creator_fees_collected = curve
            .creator_fees_collected
            .checked_add(fees.instant_fee) // Creator gets instant fee on their own buy
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.rewards_fees_collected = curve
            .rewards_fees_collected
            .checked_add(fees.buyback_burn)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_add(fees.community_rewards)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.total_buys = curve
            .total_buys
            .checked_add(1)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.unique_holders = curve
            .unique_holders
            .checked_add(1) // Creator is first holder
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

        // 2. THEN DO EXTERNAL CALLS (transfers) - V4 Fee Structure

        // Reserve (94%)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.reserve_vault.to_account_info(),
                },
            ),
            fees.reserve as u64,
        )?;

        // Instant fee to creator (2%) - creator gets this on their own buy
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.creator.to_account_info(),
                },
            ),
            fees.instant_fee as u64,
        )?;

        // Buyback/burn (1%)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.buyback_wallet.to_account_info(),
                },
            ),
            fees.buyback_burn as u64,
        )?;

        // Community rewards (1%)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.community_wallet.to_account_info(),
                },
            ),
            fees.community_rewards as u64,
        )?;

        // Platform (2%)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.platform_treasury.to_account_info(),
                },
            ),
            fees.platform as u64,
        )?;

        // 3. CLEAR REENTRANCY GUARD
        curve.set_reentrancy(false);

        msg!("✅ Creator bought {} keys for {} lamports", amount, total_cost);
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
    /// V4: Supports referral system with creator fallback
    pub fn buy_keys(
        ctx: Context<BuyKeys>,
        amount: u64,
        referrer: Option<Pubkey>,
    ) -> Result<()> {
        // Manually deserialize config and ban_list to reduce stack usage
        let config_data = ctx.accounts.config.try_borrow_data()?;
        let config = CurveConfig::try_deserialize(&mut &config_data[8..])?;

        let ban_list_data = ctx.accounts.ban_list.try_borrow_data()?;
        let ban_list = BanList::try_deserialize(&mut &ban_list_data[8..])?;

        // SECURITY: Reentrancy check
        require!(ctx.accounts.curve.check_reentrancy(), CurveError::ReentrancyDetected);
        ctx.accounts.curve.set_reentrancy(true);

        // SECURITY: Check curve is ACTIVE (not Frozen or Launched)
        require!(
            ctx.accounts.curve.status == CurveStatus::Active,
            CurveError::TradingDisabled
        );

        // SECURITY: Check buyer is not banned
        require!(
            !ban_list.is_banned(&ctx.accounts.buyer.key()),
            CurveError::AccountBanned
        );

        // SECURITY: Input validation
        ctx.accounts.curve.validate_amount(amount, config.max_purchase)?;

        // SECURITY: Validate key cap (1% of supply, min 20, max 100)
        ctx.accounts.curve.validate_key_cap(ctx.accounts.key_holder.amount, amount)?;

        // SECURITY: Validate referrer if provided
        if let Some(ref_pubkey) = referrer {
            require!(ref_pubkey != Pubkey::default(), CurveError::InvalidReferrer);
            require!(ref_pubkey != ctx.accounts.buyer.key(), CurveError::SelfReferral);
        }

        // Calculate price and fees (minimize stack usage)
        let total_cost = ctx.accounts.curve.calculate_buy_price(amount)?;
        let fees = math::calculate_buy_fees(total_cost)?;

        // 1. UPDATE STATE FIRST (CEI pattern)
        ctx.accounts.curve.supply = ctx.accounts.curve
            .supply
            .checked_add(amount as u128)
            .ok_or(CurveError::ArithmeticOverflow)?;

        ctx.accounts.curve.reserve_balance = ctx.accounts.curve
            .reserve_balance
            .checked_add(fees.reserve)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // Track creator fees only if they're the instant recipient
        if referrer.is_none() {
            ctx.accounts.curve.creator_fees_collected = ctx.accounts.curve
                .creator_fees_collected
                .checked_add(fees.instant_fee)
                .ok_or(CurveError::ArithmeticOverflow)?;
        }

        ctx.accounts.curve.rewards_fees_collected = ctx.accounts.curve
            .rewards_fees_collected
            .checked_add(fees.buyback_burn)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_add(fees.community_rewards)
            .ok_or(CurveError::ArithmeticOverflow)?;

        ctx.accounts.curve.total_buys = ctx.accounts.curve
            .total_buys
            .checked_add(1)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // Update or create key holder
        if ctx.accounts.key_holder.amount == 0 {
            let clock = Clock::get()?;
            ctx.accounts.key_holder.owner = ctx.accounts.buyer.key();
            ctx.accounts.key_holder.curve = ctx.accounts.curve.key();
            ctx.accounts.key_holder.amount = amount;
            ctx.accounts.key_holder.acquired_at = clock.unix_timestamp;
            ctx.accounts.key_holder.is_creator = false;
            ctx.accounts.key_holder.bump = ctx.bumps.key_holder;

            // Increment unique holders count
            ctx.accounts.curve.unique_holders = ctx.accounts.curve
                .unique_holders
                .checked_add(1)
                .ok_or(CurveError::ArithmeticOverflow)?;
        } else {
            ctx.accounts.key_holder.amount = ctx.accounts.key_holder
                .amount
                .checked_add(amount)
                .ok_or(CurveError::ArithmeticOverflow)?;
        }

        // 2. THEN DO EXTERNAL CALLS (transfers) - V4 Fee Structure

        // Reserve (94%)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.reserve_vault.to_account_info(),
                },
            ),
            fees.reserve as u64,
        )?;

        // Instant fee (2%) - to referrer OR creator (determined inline)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: if referrer.is_some() {
                        ctx.accounts.referrer.as_ref().unwrap().to_account_info()
                    } else {
                        ctx.accounts.creator.to_account_info()
                    },
                },
            ),
            fees.instant_fee as u64,
        )?;

        // Buyback/burn (1%)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.buyback_wallet.to_account_info(),
                },
            ),
            fees.buyback_burn as u64,
        )?;

        // Community rewards (1%)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.community_wallet.to_account_info(),
                },
            ),
            fees.community_rewards as u64,
        )?;

        // Platform (2%)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.platform_treasury.to_account_info(),
                },
            ),
            fees.platform as u64,
        )?;

        // 3. CLEAR REENTRANCY GUARD
        ctx.accounts.curve.set_reentrancy(false);

        // Emit event
        emit!(KeysPurchasedEvent {
            curve: ctx.accounts.curve.key(),
            buyer: ctx.accounts.buyer.key(),
            amount,
            cost: total_cost,
            referrer,
            instant_fee_paid: fees.instant_fee,
        });

        msg!("Keys purchased: {} for {} lamports", amount, total_cost);
        Ok(())
    }

    /// Sell keys
    /// V4: Unified 6% fee model (94% to seller, 6% split into fees)
    pub fn sell_keys(
        ctx: Context<SellKeys>,
        amount: u64,
        referrer: Option<Pubkey>, // Optional referrer (same as buy)
    ) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let holder = &mut ctx.accounts.key_holder;

        // SECURITY: Reentrancy check
        require!(curve.check_reentrancy(), CurveError::ReentrancyDetected);
        curve.set_reentrancy(true);

        // SECURITY: Check curve is ACTIVE (not Frozen or Launched)
        require!(
            curve.status == CurveStatus::Active,
            CurveError::TradingDisabled
        );

        // SECURITY: Check seller is not banned
        require!(
            !ctx.accounts.ban_list.is_banned(&ctx.accounts.seller.key()),
            CurveError::AccountBanned
        );

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

        // SECURITY: Validate referrer if provided
        if let Some(ref_pubkey) = referrer {
            require!(ref_pubkey != Pubkey::default(), CurveError::InvalidReferrer);
            require!(ref_pubkey != ctx.accounts.seller.key(), CurveError::SelfReferral);
        }

        // Calculate gross return (before fees)
        let gross_return = math::calculate_buy_cost(curve.supply - amount as u128, amount)?;

        // Calculate V4 fee distribution (6% total)
        let sell_fees = math::calculate_sell_fees(gross_return)?;

        // Total to deduct from reserve
        let total_from_reserve = gross_return; // Seller gets net, fees stay in reserve

        // SECURITY: Check reserve has enough balance
        require!(
            curve.reserve_balance >= total_from_reserve,
            CurveError::InsufficientReserve
        );

        // Determine instant fee recipient (referrer OR creator fallback)
        let (instant_recipient, instant_recipient_key) = if let Some(ref_pubkey) = referrer {
            (ctx.accounts.referrer.as_ref().unwrap().to_account_info(), ref_pubkey)
        } else {
            (ctx.accounts.creator.to_account_info(), curve.creator)
        };

        // 1. UPDATE STATE FIRST (CEI pattern)
        curve.supply = curve
            .supply
            .checked_sub(amount as u128)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // Reserve reduces by gross amount (fees are distributed separately)
        curve.reserve_balance = curve
            .reserve_balance
            .checked_sub(gross_return)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // Track creator fees if they're the instant recipient
        if referrer.is_none() {
            curve.creator_fees_collected = curve
                .creator_fees_collected
                .checked_add(sell_fees.instant_fee)
                .ok_or(CurveError::ArithmeticOverflow)?;
        }

        curve.rewards_fees_collected = curve
            .rewards_fees_collected
            .checked_add(sell_fees.buyback_burn)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_add(sell_fees.community_rewards)
            .ok_or(CurveError::ArithmeticOverflow)?;

        curve.total_sells = curve
            .total_sells
            .checked_add(1)
            .ok_or(CurveError::ArithmeticOverflow)?;

        holder.amount = holder
            .amount
            .checked_sub(amount)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // 2. THEN DO EXTERNAL CALLS (transfers from reserve)
        let curve_key = curve.key();
        let seeds = &[
            b"reserve",
            curve_key.as_ref(),
            &[curve.reserve_bump],
        ];
        let signer = &[&seeds[..]];

        // Pay seller (94% of gross)
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: ctx.accounts.seller.to_account_info(),
                },
                signer,
            ),
            sell_fees.to_seller as u64,
        )?;

        // Instant fee (2% of gross) - to referrer OR creator
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: instant_recipient,
                },
                signer,
            ),
            sell_fees.instant_fee as u64,
        )?;

        // Buyback/burn (1% of gross)
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: ctx.accounts.buyback_wallet.to_account_info(),
                },
                signer,
            ),
            sell_fees.buyback_burn as u64,
        )?;

        // Community rewards (1% of gross)
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: ctx.accounts.community_wallet.to_account_info(),
                },
                signer,
            ),
            sell_fees.community_rewards as u64,
        )?;

        // Platform (2% of gross)
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: ctx.accounts.platform_treasury.to_account_info(),
                },
                signer,
            ),
            sell_fees.platform as u64,
        )?;

        // 3. CLEAR REENTRANCY GUARD
        curve.set_reentrancy(false);

        // Emit event
        emit!(KeysSoldEvent {
            curve: curve.key(),
            seller: ctx.accounts.seller.key(),
            amount,
            payout: sell_fees.to_seller,
            gross_return,
        });

        msg!("✅ Keys sold: {} | Seller received: {} lamports", amount, sell_fees.to_seller);
        msg!("Instant fee recipient: {} earned {} lamports",
            instant_recipient_key,
            sell_fees.instant_fee
        );
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

    // ============================================================================
    // V4 FREEZE SYSTEM
    // ============================================================================

    /// Manually freeze the curve (creator only)
    pub fn freeze_manual(ctx: Context<FreezeCurve>) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let clock = Clock::get()?;

        // SECURITY: Only creator can manually freeze
        require!(
            curve.creator == ctx.accounts.creator.key(),
            CurveError::Unauthorized
        );

        // Execute freeze
        curve.execute_freeze("manual", clock.unix_timestamp)?;

        // Emit event
        emit!(CurveFrozenEvent {
            curve_id: curve.key(),
            trigger: "manual".to_string(),
            supply: curve.supply_at_freeze,
            reserve: curve.reserve_at_freeze,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Auto-freeze if reserve threshold is met (32 SOL)
    /// Anyone can call this once threshold is reached
    pub fn freeze_if_reserve(ctx: Context<FreezeCurve>) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let clock = Clock::get()?;

        // Check if reserve threshold is met
        require!(
            curve.is_reserve_threshold_met(),
            CurveError::ReserveThresholdNotMet
        );

        // Execute freeze
        curve.execute_freeze("reserve_threshold", clock.unix_timestamp)?;

        // Emit event
        emit!(CurveFrozenEvent {
            curve_id: curve.key(),
            trigger: "reserve_threshold".to_string(),
            supply: curve.supply_at_freeze,
            reserve: curve.reserve_at_freeze,
            timestamp: clock.unix_timestamp,
        });

        msg!("🎯 Reserve threshold reached: {} SOL", curve.target_reserve / 1_000_000_000);
        Ok(())
    }

    /// Auto-freeze if launch time is reached
    /// Anyone can call this once time threshold is met
    pub fn freeze_if_time(ctx: Context<FreezeCurve>) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let clock = Clock::get()?;

        // Check if launch time is set
        require!(
            curve.launch_ts.is_some(),
            CurveError::LaunchTimeNotSet
        );

        // Check if time threshold is met
        require!(
            curve.is_time_threshold_met(clock.unix_timestamp),
            CurveError::LaunchTimeNotReached
        );

        // Execute freeze
        curve.execute_freeze("time_based", clock.unix_timestamp)?;

        // Emit event
        emit!(CurveFrozenEvent {
            curve_id: curve.key(),
            trigger: "time_based".to_string(),
            supply: curve.supply_at_freeze,
            reserve: curve.reserve_at_freeze,
            timestamp: clock.unix_timestamp,
        });

        msg!("⏰ Launch time reached");
        Ok(())
    }

    // ============================================================================
    // V4 SNAPSHOT SYSTEM
    // ============================================================================

    /// Create snapshot with Merkle root (after freeze, before launch)
    pub fn create_snapshot(
        ctx: Context<CreateSnapshot>,
        merkle_root: [u8; 32],
        total_holders: u32,
    ) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let snapshot = &mut ctx.accounts.snapshot;
        let clock = Clock::get()?;

        // SECURITY: Only creator can create snapshot
        require!(
            curve.creator == ctx.accounts.creator.key(),
            CurveError::Unauthorized
        );

        // SECURITY: Curve must be frozen
        require!(
            curve.status == CurveStatus::Frozen,
            CurveError::CurveNotFrozen
        );

        // SECURITY: Snapshot can only be created once
        require!(
            curve.snapshot_root.is_none(),
            CurveError::SnapshotAlreadyExists
        );

        // Initialize snapshot account
        snapshot.curve = curve.key();
        snapshot.merkle_root = merkle_root;
        snapshot.total_supply = curve.supply_at_freeze;
        snapshot.total_holders = total_holders;
        snapshot.total_token_pool = 0; // Set after launch when tokens are bought
        snapshot.created_at = clock.unix_timestamp;
        snapshot.bump = ctx.bumps.snapshot;

        // Store merkle root in curve
        curve.snapshot_root = Some(merkle_root);

        // Emit event
        emit!(SnapshotCreatedEvent {
            curve_id: curve.key(),
            snapshot: snapshot.key(),
            merkle_root,
            total_supply: curve.supply_at_freeze,
            total_holders,
            timestamp: clock.unix_timestamp,
        });

        msg!("📸 Snapshot created");
        msg!("Merkle root: {:?}", merkle_root);
        msg!("Total holders: {}", total_holders);
        Ok(())
    }

    // ============================================================================
    // V4 LAUNCH SYSTEM
    // ============================================================================

    /// Launch token (split reserve, emit event for off-chain service)
    pub fn launch(
        ctx: Context<LaunchToken>,
        initial_buy_percentage: u8, // 20-30%
    ) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        let clock = Clock::get()?;

        // SECURITY: Only creator can launch
        require!(
            curve.creator == ctx.accounts.creator.key(),
            CurveError::Unauthorized
        );

        // SECURITY: Must be frozen and have snapshot
        require!(curve.can_launch(), CurveError::CurveNotFrozen);

        // SECURITY: Prevent double launch
        require!(!curve.is_launching, CurveError::AlreadyLaunched);
        curve.is_launching = true;

        // Validate percentage (20-30%)
        require!(
            initial_buy_percentage >= 20 && initial_buy_percentage <= 30,
            CurveError::InvalidAmount
        );

        let total_reserve = curve.reserve_at_freeze;

        // Calculate splits
        let initial_buy_sol = total_reserve
            .checked_mul(initial_buy_percentage as u128)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(100)
            .ok_or(CurveError::ArithmeticOverflow)?;

        let marketing_sol = total_reserve
            .checked_mul(50)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(100)
            .ok_or(CurveError::ArithmeticOverflow)?;

        let utility_sol = total_reserve
            .checked_sub(initial_buy_sol)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_sub(marketing_sol)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // SECURITY: Check reserve has enough funds
        require!(
            curve.reserve_balance >= total_reserve,
            CurveError::InsufficientReserve
        );

        // 1. UPDATE STATE FIRST
        curve.status = CurveStatus::Launched;
        curve.launched_at = Some(clock.unix_timestamp);
        curve.initial_buy_amount = initial_buy_sol;
        curve.lp_vault = Some(ctx.accounts.lp_vault.key());
        curve.marketing_wallet = Some(ctx.accounts.marketing_wallet.key());
        curve.utility_wallet = Some(ctx.accounts.utility_wallet.key());

        // Reduce reserve balance
        curve.reserve_balance = curve
            .reserve_balance
            .checked_sub(total_reserve)
            .ok_or(CurveError::ArithmeticOverflow)?;

        // 2. TRANSFER FUNDS FROM RESERVE
        let curve_key = curve.key();
        let seeds = &[
            b"reserve",
            curve_key.as_ref(),
            &[curve.reserve_bump],
        ];
        let signer = &[&seeds[..]];

        // Transfer to LP vault (for Pump.fun initial buy)
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: ctx.accounts.lp_vault.to_account_info(),
                },
                signer,
            ),
            initial_buy_sol as u64,
        )?;

        // Transfer to marketing wallet
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: ctx.accounts.marketing_wallet.to_account_info(),
                },
                signer,
            ),
            marketing_sol as u64,
        )?;

        // Transfer to utility wallet
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.reserve_vault.to_account_info(),
                    to: ctx.accounts.utility_wallet.to_account_info(),
                },
                signer,
            ),
            utility_sol as u64,
        )?;

        // 3. EMIT EVENT FOR OFF-CHAIN SERVICE
        emit!(CurveLaunchedEvent {
            curve_id: curve.key(),
            token_mint: None, // Set by off-chain service after Pump.fun creation
            snapshot_root: curve.snapshot_root.unwrap(),
            supply_at_launch: curve.supply_at_freeze,
            initial_buy_sol,
            marketing_sol,
            utility_sol,
            lp_vault: ctx.accounts.lp_vault.key(),
            marketing_wallet: ctx.accounts.marketing_wallet.key(),
            utility_wallet: ctx.accounts.utility_wallet.key(),
            timestamp: clock.unix_timestamp,
        });

        msg!("🚀 LAUNCHED!");
        msg!("Initial buy: {} SOL ({} %)", initial_buy_sol / 1_000_000_000, initial_buy_percentage);
        msg!("Marketing: {} SOL", marketing_sol / 1_000_000_000);
        msg!("Utility: {} SOL", utility_sol / 1_000_000_000);
        msg!("Off-chain service will now:");
        msg!("1. Create token on Pump.fun");
        msg!("2. Buy tokens with LP vault SOL");
        msg!("3. Store tokens in airdrop vault");
        msg!("4. Key holders can then claim via Merkle proof");
        Ok(())
    }

    // ============================================================================
    // V4 CLAIM SYSTEM
    // ============================================================================

    /// Claim tokens using Merkle proof
    pub fn claim_tokens(
        ctx: Context<ClaimTokens>,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        let snapshot = &ctx.accounts.snapshot;
        let holder = &ctx.accounts.key_holder;
        let claim_record = &mut ctx.accounts.claim_record;
        let clock = Clock::get()?;

        // SECURITY: Prevent double claiming
        require!(
            claim_record.amount_claimed == 0,
            CurveError::AlreadyClaimed
        );

        // Verify Merkle proof
        let leaf = anchor_lang::solana_program::keccak::hashv(&[
            holder.owner.as_ref(),
            &holder.amount.to_le_bytes(),
        ]);

        let is_valid = verify_merkle_proof(&proof, &snapshot.merkle_root, &leaf.0);
        require!(is_valid, CurveError::InvalidMerkleProof);

        // Calculate token allocation
        // (holder's keys / total keys) * total token pool
        let token_amount = (holder.amount as u128)
            .checked_mul(snapshot.total_token_pool as u128)
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(snapshot.total_supply)
            .ok_or(CurveError::ArithmeticOverflow)? as u64;

        // Transfer tokens from airdrop vault to holder
        // (This will be implemented with actual SPL token transfer once we have the mint)
        // For now, we just record the claim

        // Record claim
        claim_record.snapshot = snapshot.key();
        claim_record.holder = holder.owner;
        claim_record.amount_claimed = token_amount;
        claim_record.claimed_at = clock.unix_timestamp;
        claim_record.bump = ctx.bumps.claim_record;

        // Emit event
        emit!(TokensClaimedEvent {
            snapshot: snapshot.key(),
            holder: holder.owner,
            keys_held: holder.amount,
            tokens_claimed: token_amount,
            timestamp: clock.unix_timestamp,
        });

        msg!("✅ Tokens claimed: {}", token_amount);
        msg!("Keys held: {}", holder.amount);
        Ok(())
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/// Verify Merkle proof
fn verify_merkle_proof(proof: &[[u8; 32]], root: &[u8; 32], leaf: &[u8; 32]) -> bool {
    let mut computed_hash = *leaf;

    for proof_element in proof.iter() {
        computed_hash = if computed_hash <= *proof_element {
            anchor_lang::solana_program::keccak::hashv(&[
                &computed_hash,
                proof_element,
            ]).0
        } else {
            anchor_lang::solana_program::keccak::hashv(&[
                proof_element,
                &computed_hash,
            ]).0
        };
    }

    computed_hash == *root
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

    /// CHECK: Buyback/burn wallet
    #[account(mut, address = curve.buyback_wallet)]
    pub buyback_wallet: AccountInfo<'info>,

    /// CHECK: Community rewards wallet
    #[account(mut, address = curve.community_wallet)]
    pub community_wallet: AccountInfo<'info>,

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

    /// CHECK: Buyback/burn wallet
    #[account(mut, address = curve.buyback_wallet)]
    pub buyback_wallet: AccountInfo<'info>,

    /// CHECK: Community rewards wallet
    #[account(mut, address = curve.community_wallet)]
    pub community_wallet: AccountInfo<'info>,

    /// CHECK: Optional referrer for fee distribution
    #[account(mut)]
    pub referrer: Option<AccountInfo<'info>>,

    /// CHECK: Config account (validation done in instruction)
    pub config: UncheckedAccount<'info>,

    /// CHECK: Ban list account (validation done in instruction)
    pub ban_list: UncheckedAccount<'info>,

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

    /// CHECK: Creator wallet for fee distribution
    #[account(mut, address = curve.creator)]
    pub creator: AccountInfo<'info>,

    /// CHECK: Platform treasury
    #[account(mut, address = curve.platform_treasury)]
    pub platform_treasury: AccountInfo<'info>,

    /// CHECK: Buyback/burn wallet
    #[account(mut, address = curve.buyback_wallet)]
    pub buyback_wallet: AccountInfo<'info>,

    /// CHECK: Community rewards wallet
    #[account(mut, address = curve.community_wallet)]
    pub community_wallet: AccountInfo<'info>,

    /// CHECK: Optional referrer for fee distribution
    #[account(mut)]
    pub referrer: Option<AccountInfo<'info>>,

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

// ============================================================================
// V4 CONTEXT STRUCTS
// ============================================================================

#[derive(Accounts)]
pub struct FreezeCurve<'info> {
    #[account(
        mut,
        seeds = [b"curve", curve.twitter_handle.as_bytes()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,

    /// Creator (for manual freeze) or anyone (for auto-freeze)
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateSnapshot<'info> {
    #[account(
        mut,
        seeds = [b"curve", curve.twitter_handle.as_bytes()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,

    #[account(
        init,
        payer = creator,
        space = Snapshot::LEN,
        seeds = [b"snapshot", curve.key().as_ref()],
        bump
    )]
    pub snapshot: Account<'info, Snapshot>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LaunchToken<'info> {
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

    /// CHECK: LP vault to receive SOL for initial Pump.fun buy
    #[account(mut)]
    pub lp_vault: AccountInfo<'info>,

    /// CHECK: Marketing wallet
    #[account(mut)]
    pub marketing_wallet: AccountInfo<'info>,

    /// CHECK: Utility wallet
    #[account(mut)]
    pub utility_wallet: AccountInfo<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(
        seeds = [b"snapshot", snapshot.curve.as_ref()],
        bump = snapshot.bump
    )]
    pub snapshot: Account<'info, Snapshot>,

    #[account(
        seeds = [b"holder", key_holder.curve.as_ref(), key_holder.owner.as_ref()],
        bump = key_holder.bump
    )]
    pub key_holder: Account<'info, KeyHolder>,

    #[account(
        init,
        payer = claimer,
        space = ClaimRecord::LEN,
        seeds = [b"claim", snapshot.key().as_ref(), key_holder.owner.as_ref()],
        bump
    )]
    pub claim_record: Account<'info, ClaimRecord>,

    #[account(mut)]
    pub claimer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
