use anchor_lang::prelude::*;

/// Status of the bonding curve
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum CurveStatus {
    /// Created but not yet activated (hidden from public)
    Pending,
    /// Creator has bought minimum keys, now public
    Active,
    /// Trading frozen, snapshot taken, ready for token launch
    Frozen,
    /// Token minted and launched on Pump.fun
    Launched,
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
    // ===== Identity =====
    /// Creator/owner of this curve
    pub creator: Pubkey,

    /// Verified Twitter handle
    pub twitter_handle: String,

    /// Type of curve (Profile or Project)
    pub curve_type: CurveType,

    // ===== State =====
    /// Current status
    pub status: CurveStatus,

    /// Current supply of keys in circulation
    pub supply: u128,

    /// Total SOL in reserve vault
    pub reserve_balance: u128,

    /// Number of unique key holders
    pub unique_holders: u32,

    // ===== Timestamps =====
    /// Timestamp when curve was created
    pub created_at: i64,

    /// Timestamp when curve was activated
    pub activated_at: i64,

    /// Timestamp when creator's keys unlock
    pub creator_unlock_time: i64,

    // ===== Freeze System (NEW) =====
    /// Optional launch timestamp for time-based auto-freeze
    pub launch_ts: Option<i64>,

    /// Target reserve for auto-freeze (default: 32 SOL = 32_000_000_000 lamports)
    pub target_reserve: u64,

    /// Timestamp when curve was frozen
    pub freeze_ts: Option<i64>,

    /// Trigger that caused freeze: "manual", "reserve_threshold", "time_based"
    pub freeze_trigger: Option<String>,

    /// Supply at time of freeze (locked for snapshot)
    pub supply_at_freeze: u128,

    /// Reserve balance at time of freeze (locked for distribution)
    pub reserve_at_freeze: u128,

    // ===== Snapshot (NEW) =====
    /// Merkle root of holder snapshot (for token claims)
    pub snapshot_root: Option<[u8; 32]>,

    // ===== Launch (NEW) =====
    /// Token mint address (set after launch)
    pub token_mint: Option<Pubkey>,

    /// LP vault for initial Pump.fun buy
    pub lp_vault: Option<Pubkey>,

    /// Marketing wallet address
    pub marketing_wallet: Option<Pubkey>,

    /// Utility wallet address
    pub utility_wallet: Option<Pubkey>,

    /// Timestamp when token was launched
    pub launched_at: Option<i64>,

    /// SOL amount used for initial Pump.fun buy
    pub initial_buy_amount: u128,

    /// Reentrancy flag for launch (prevent double launch)
    pub is_launching: bool,

    // ===== Fee Tracking =====
    /// Total fees collected by creator (deprecated, kept for migration)
    pub creator_fees_collected: u128,

    /// Total rewards fees collected (1% buyback + 1% community)
    pub rewards_fees_collected: u128,

    // ===== Stats =====
    /// Total number of buy transactions
    pub total_buys: u64,

    /// Total number of sell transactions
    pub total_sells: u64,

    // ===== Configuration =====
    /// Platform treasury address
    pub platform_treasury: Pubkey,

    /// Buyback/burn wallet address
    pub buyback_wallet: Pubkey,

    /// Community rewards wallet address
    pub community_wallet: Pubkey,

    // ===== Security =====
    /// Reentrancy guard (SECURITY: Prevents reentrancy attacks)
    pub reentrancy_guard: bool,

    // ===== PDA Bumps =====
    /// Reserve vault PDA bump
    pub reserve_bump: u8,

    /// Curve account bump
    pub bump: u8,
}

impl BondingCurve {
    /// Space calculation for account allocation
    pub const LEN: usize = 8 + // discriminator
        // Identity
        32 + // creator
        (4 + 32) + // twitter_handle (String with max 32 chars)
        1 + // curve_type enum
        // State
        1 + // status enum
        16 + // supply (u128)
        16 + // reserve_balance (u128)
        4 + // unique_holders (u32)
        // Timestamps
        8 + // created_at
        8 + // activated_at
        8 + // creator_unlock_time
        // Freeze System
        (1 + 8) + // launch_ts (Option<i64>)
        8 + // target_reserve (u64)
        (1 + 8) + // freeze_ts (Option<i64>)
        (1 + 4 + 20) + // freeze_trigger (Option<String> max 20 chars)
        16 + // supply_at_freeze (u128)
        16 + // reserve_at_freeze (u128)
        // Snapshot
        (1 + 32) + // snapshot_root (Option<[u8; 32]>)
        // Launch
        (1 + 32) + // token_mint (Option<Pubkey>)
        (1 + 32) + // lp_vault (Option<Pubkey>)
        (1 + 32) + // marketing_wallet (Option<Pubkey>)
        (1 + 32) + // utility_wallet (Option<Pubkey>)
        (1 + 8) + // launched_at (Option<i64>)
        16 + // initial_buy_amount (u128)
        1 + // is_launching (bool)
        // Fee Tracking
        16 + // creator_fees_collected (u128)
        16 + // rewards_fees_collected (u128)
        // Stats
        8 + // total_buys (u64)
        8 + // total_sells (u64)
        // Configuration
        32 + // platform_treasury
        32 + // buyback_wallet
        32 + // community_wallet
        // Security
        1 + // reentrancy_guard (bool)
        // PDA Bumps
        1 + // reserve_bump (u8)
        1; // bump (u8)
    // TOTAL: ~550 bytes (rounded up to 600 for safety)

    /// SECURITY: Check if reentrancy guard is active
    pub fn check_reentrancy(&self) -> bool {
        !self.reentrancy_guard
    }

    /// SECURITY: Set reentrancy guard
    pub fn set_reentrancy(&mut self, value: bool) {
        self.reentrancy_guard = value;
    }

    /// Calculate buy price using hybrid exponential bonding curve
    /// Formula: P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6
    /// SECURITY: Uses checked arithmetic via math module
    pub fn calculate_buy_price(&self, amount: u64) -> Result<u128> {
        crate::math::calculate_buy_cost(self.supply, amount)
    }

    /// Calculate sell return with unified 6% fee
    /// SECURITY: Uses checked arithmetic via math module
    pub fn calculate_sell_price(&self, amount: u64) -> Result<u128> {
        crate::math::calculate_sell_return(self.supply, amount)
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

    /// Validate purchase against per-wallet key cap
    /// Max keys per wallet = 1% of supply, min 20, max 100
    pub fn validate_key_cap(&self, holder_amount: u64, purchase_amount: u64) -> Result<()> {
        let max_keys = self.get_max_keys_per_wallet();
        let new_total = holder_amount
            .checked_add(purchase_amount)
            .ok_or(error!(crate::errors::CurveError::ArithmeticOverflow))?;

        require!(
            new_total <= max_keys,
            crate::errors::CurveError::ExceedsMaxKeysPerWallet
        );

        Ok(())
    }

    /// Calculate max keys per wallet (1% of supply, min 20, max 100)
    pub fn get_max_keys_per_wallet(&self) -> u64 {
        const MIN_KEYS: u64 = 20;
        const MAX_KEYS: u64 = 100;

        let one_percent = (self.supply / 100) as u64;

        one_percent.max(MIN_KEYS).min(MAX_KEYS)
    }

    /// Check if keys are locked (for creator)
    pub fn are_keys_locked(&self, current_time: i64) -> bool {
        current_time < self.creator_unlock_time
    }

    /// Check if curve can be frozen (is Active and not already frozen)
    pub fn can_freeze(&self) -> bool {
        self.status == CurveStatus::Active && self.freeze_ts.is_none()
    }

    /// Check if reserve threshold is met for auto-freeze
    pub fn is_reserve_threshold_met(&self) -> bool {
        self.reserve_balance >= self.target_reserve as u128
    }

    /// Check if time-based freeze condition is met
    pub fn is_time_threshold_met(&self, current_time: i64) -> bool {
        if let Some(launch_ts) = self.launch_ts {
            current_time >= launch_ts
        } else {
            false
        }
    }

    /// Execute freeze (shared logic for all freeze triggers)
    pub fn execute_freeze(&mut self, trigger: &str, current_time: i64) -> Result<()> {
        require!(self.can_freeze(), crate::errors::CurveError::AlreadyFrozen);

        self.status = CurveStatus::Frozen;
        self.freeze_ts = Some(current_time);
        self.freeze_trigger = Some(trigger.to_string());
        self.supply_at_freeze = self.supply;
        self.reserve_at_freeze = self.reserve_balance;

        msg!("🧊 Curve FROZEN | Trigger: {} | Supply: {} | Reserve: {} lamports",
            trigger,
            self.supply,
            self.reserve_balance
        );

        Ok(())
    }

    /// Check if curve can be launched
    pub fn can_launch(&self) -> bool {
        self.status == CurveStatus::Frozen
            && self.snapshot_root.is_some()
            && !self.is_launching
            && self.launched_at.is_none()
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

    /// Buyback/burn wallet
    pub buyback_wallet: Pubkey,

    /// Community rewards wallet
    pub community_wallet: Pubkey,

    /// Maximum keys per transaction (anti-manipulation)
    pub max_purchase: u64,

    /// Minimum keys creator must buy (10 for profiles, 10-100 for projects)
    pub creator_min_buy: u64,

    /// Lock period in seconds (7 days = 604800)
    pub lock_period: i64,

    /// Default target reserve for auto-freeze (32 SOL = 32_000_000_000)
    pub target_reserve_default: u64,

    /// Global pause switch
    pub paused: bool,

    /// Bump seed
    pub bump: u8,
}

impl CurveConfig {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // platform_treasury
        32 + // buyback_wallet
        32 + // community_wallet
        8 + // max_purchase
        8 + // creator_min_buy
        8 + // lock_period
        8 + // target_reserve_default
        1 + // paused
        1; // bump
    // TOTAL: 170 bytes (pad to 200 for safety)
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

/// Snapshot account (stores Merkle root for token claims)
#[account]
pub struct Snapshot {
    /// Bonding curve this snapshot belongs to
    pub curve: Pubkey,

    /// Merkle root of all key holders
    pub merkle_root: [u8; 32],

    /// Total supply at freeze (locked)
    pub total_supply: u128,

    /// Total number of unique holders
    pub total_holders: u32,

    /// Total tokens allocated for this snapshot (from Pump.fun buy)
    pub total_token_pool: u64,

    /// Timestamp when snapshot was created
    pub created_at: i64,

    /// Bump seed for PDA
    pub bump: u8,
}

impl Snapshot {
    pub const LEN: usize = 8 + // discriminator
        32 + // curve
        32 + // merkle_root
        16 + // total_supply
        4 + // total_holders
        8 + // total_token_pool
        8 + // created_at
        1; // bump
    // TOTAL: 109 bytes (pad to 128)
}

/// Claim record (tracks if a user has claimed their tokens)
#[account]
pub struct ClaimRecord {
    /// Snapshot this claim belongs to
    pub snapshot: Pubkey,

    /// Holder who claimed
    pub holder: Pubkey,

    /// Amount of tokens claimed
    pub amount_claimed: u64,

    /// Timestamp when claimed
    pub claimed_at: i64,

    /// Bump seed for PDA
    pub bump: u8,
}

impl ClaimRecord {
    pub const LEN: usize = 8 + // discriminator
        32 + // snapshot
        32 + // holder
        8 + // amount_claimed
        8 + // claimed_at
        1; // bump
    // TOTAL: 89 bytes (pad to 128)
}
