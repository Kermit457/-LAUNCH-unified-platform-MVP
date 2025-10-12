use anchor_lang::prelude::*;

/// Status of the bonding curve
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum CurveStatus {
    /// Created but not yet activated (hidden from public)
    Pending,
    /// Creator has bought minimum keys, now public
    Active,
    /// Emergency pause by admin
    Paused,
    /// Curve has been migrated to DEX
    Migrated,
}

/// Type of curve (Profile vs Project)
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum CurveType {
    /// Individual creator profile
    Profile,
    /// Project/company curve
    Project,
}

/// Main bonding curve account
#[account]
pub struct BondingCurve {
    /// Creator/owner of this curve
    pub creator: Pubkey,

    /// Verified Twitter handle
    pub twitter_handle: String,

    /// Type of curve (Profile or Project)
    pub curve_type: CurveType,

    /// Current status
    pub status: CurveStatus,

    /// Current supply of keys in circulation
    pub supply: u128, // Using u128 to prevent overflow

    /// Total SOL in reserve vault
    pub reserve_balance: u128,

    /// Total fees collected by creator
    pub creator_fees_collected: u128,

    /// Timestamp when curve was created
    pub created_at: i64,

    /// Timestamp when curve was activated
    pub activated_at: i64,

    /// Timestamp when creator's keys unlock
    pub creator_unlock_time: i64,

    /// Reserve vault PDA bump
    pub reserve_bump: u8,

    /// Curve account bump
    pub bump: u8,

    /// Reentrancy guard (SECURITY: Prevents reentrancy attacks)
    pub reentrancy_guard: bool,

    /// Total number of buy transactions
    pub total_buys: u64,

    /// Total number of sell transactions
    pub total_sells: u64,

    /// Platform treasury address
    pub platform_treasury: Pubkey,
}

impl BondingCurve {
    /// Space calculation for account allocation
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        (4 + 32) + // twitter_handle (String with max 32 chars)
        1 + // curve_type enum
        1 + // status enum
        16 + // supply (u128)
        16 + // reserve_balance (u128)
        16 + // creator_fees_collected (u128)
        8 + // created_at
        8 + // activated_at
        8 + // creator_unlock_time
        1 + // reserve_bump
        1 + // bump
        1 + // reentrancy_guard
        8 + // total_buys
        8 + // total_sells
        32; // platform_treasury

    /// SECURITY: Check if reentrancy guard is active
    pub fn check_reentrancy(&self) -> bool {
        !self.reentrancy_guard
    }

    /// SECURITY: Set reentrancy guard
    pub fn set_reentrancy(&mut self, value: bool) {
        self.reentrancy_guard = value;
    }

    /// Calculate buy price using linear bonding curve
    /// Formula: price = supply * 0.0001 SOL
    /// SECURITY: Uses checked arithmetic to prevent overflow
    pub fn calculate_buy_price(&self, amount: u64) -> Result<u128> {
        let amount_u128 = amount as u128;
        let current_supply = self.supply;

        // Calculate total cost: sum from current_supply to (current_supply + amount)
        // For linear curve: cost = (start + end) * amount / 2 * 0.0001
        // Where start = current_supply, end = current_supply + amount

        let start = current_supply;
        let end = current_supply
            .checked_add(amount_u128)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        let sum = start
            .checked_add(end)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        let product = sum
            .checked_mul(amount_u128)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        let total_cost = product
            .checked_div(2)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        // Convert to lamports (multiply by 0.0001 SOL = 100,000 lamports)
        let lamports = total_cost
            .checked_mul(100_000)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        Ok(lamports)
    }

    /// Calculate sell price with 5% tax
    /// SECURITY: Uses checked arithmetic
    pub fn calculate_sell_price(&self, amount: u64) -> Result<u128> {
        let amount_u128 = amount as u128;

        // Ensure we have enough supply to sell
        require!(
            self.supply >= amount_u128,
            crate::errors::CurveError::InsufficientReserve
        );

        let new_supply = self.supply
            .checked_sub(amount_u128)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        // Calculate sell value (same as buy formula but in reverse)
        let start = new_supply;
        let end = self.supply;

        let sum = start
            .checked_add(end)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        let product = sum
            .checked_mul(amount_u128)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        let total_value = product
            .checked_div(2)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        let lamports = total_value
            .checked_mul(100_000)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        // Apply 5% sell tax
        let after_tax = lamports
            .checked_mul(95)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?
            .checked_div(100)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        Ok(after_tax)
    }

    /// SECURITY: Validate amount is within acceptable range
    pub fn validate_amount(&self, amount: u64, max_purchase: u64) -> Result<()> {
        require!(
            amount > 0,
            crate::errors::CurveError::InvalidAmount
        );
        require!(
            amount <= max_purchase,
            crate::errors::CurveError::ExceedsMaxPurchase
        );
        Ok(())
    }

    /// Check if keys are locked (for creator)
    pub fn are_keys_locked(&self, current_time: i64) -> bool {
        current_time < self.creator_unlock_time
    }
}

/// User's key holdings for a specific curve
#[account]
pub struct KeyHolder {
    /// Owner of these keys
    pub owner: Pubkey,

    /// Bonding curve these keys belong to
    pub curve: Pubkey,

    /// Number of keys held
    pub amount: u64,

    /// Timestamp when keys were acquired
    pub acquired_at: i64,

    /// Is this the creator's holding? (subject to 7-day lock)
    pub is_creator: bool,

    /// Bump seed for PDA
    pub bump: u8,
}

impl KeyHolder {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        32 + // curve
        8 + // amount
        8 + // acquired_at
        1 + // is_creator
        1; // bump
}

/// Admin configuration account
#[account]
pub struct CurveConfig {
    /// Admin authority who can pause/unpause
    pub authority: Pubkey,

    /// Platform treasury for fees
    pub platform_treasury: Pubkey,

    /// Maximum keys per transaction (anti-manipulation)
    pub max_purchase: u64,

    /// Minimum keys creator must buy (10 for profiles, 10-100 for projects)
    pub creator_min_buy: u64,

    /// Lock period in seconds (7 days = 604800)
    pub lock_period: i64,

    /// Global pause switch
    pub paused: bool,

    /// Bump seed
    pub bump: u8,
}

impl CurveConfig {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // platform_treasury
        8 + // max_purchase
        8 + // creator_min_buy
        8 + // lock_period
        1 + // paused
        1; // bump
}

/// Ban list for reported bots
#[account]
pub struct BanList {
    /// Admin authority
    pub authority: Pubkey,

    /// Banned accounts (we'll use a Vec for simplicity, could use a Merkle tree for scale)
    pub banned_accounts: Vec<Pubkey>,

    /// Bump seed
    pub bump: u8,
}

impl BanList {
    pub const MAX_BANS: usize = 1000;

    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        (4 + 32 * Self::MAX_BANS) + // banned_accounts vec
        1; // bump

    /// Check if an account is banned
    pub fn is_banned(&self, account: &Pubkey) -> bool {
        self.banned_accounts.contains(account)
    }
}
