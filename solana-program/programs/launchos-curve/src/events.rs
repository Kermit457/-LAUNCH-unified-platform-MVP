use anchor_lang::prelude::*;

/// Event emitted when a curve is frozen
#[event]
pub struct CurveFrozenEvent {
    /// Curve that was frozen
    pub curve_id: Pubkey,

    /// Trigger that caused the freeze
    pub trigger: String,

    /// Supply at time of freeze
    pub supply: u128,

    /// Reserve balance at time of freeze
    pub reserve: u128,

    /// Timestamp when frozen
    pub timestamp: i64,
}

/// Event emitted when a snapshot is created
#[event]
pub struct SnapshotCreatedEvent {
    /// Curve ID
    pub curve_id: Pubkey,

    /// Snapshot account address
    pub snapshot: Pubkey,

    /// Merkle root
    pub merkle_root: [u8; 32],

    /// Total supply captured
    pub total_supply: u128,

    /// Total number of holders
    pub total_holders: u32,

    /// Timestamp
    pub timestamp: i64,
}

/// Event emitted when a curve is launched
#[event]
pub struct CurveLaunchedEvent {
    /// Curve ID
    pub curve_id: Pubkey,

    /// Token mint address (Pump.fun token)
    pub token_mint: Option<Pubkey>,

    /// Snapshot root used for claims
    pub snapshot_root: [u8; 32],

    /// Supply at launch
    pub supply_at_launch: u128,

    /// Reserve split details
    pub initial_buy_sol: u128,
    pub marketing_sol: u128,
    pub utility_sol: u128,

    /// LP vault address
    pub lp_vault: Pubkey,

    /// Marketing wallet
    pub marketing_wallet: Pubkey,

    /// Utility wallet
    pub utility_wallet: Pubkey,

    /// Timestamp
    pub timestamp: i64,
}

/// Event emitted when keys are purchased
#[event]
pub struct KeysPurchasedEvent {
    /// Curve ID
    pub curve: Pubkey,

    /// Buyer address
    pub buyer: Pubkey,

    /// Amount of keys purchased
    pub amount: u64,

    /// Total cost in lamports
    pub cost: u128,

    /// Referrer (if any)
    pub referrer: Option<Pubkey>,

    /// Amount earned by referrer (or creator if no referrer)
    pub instant_fee_paid: u128,
}

/// Event emitted when keys are sold
#[event]
pub struct KeysSoldEvent {
    /// Curve ID
    pub curve: Pubkey,

    /// Seller address
    pub seller: Pubkey,

    /// Amount of keys sold
    pub amount: u64,

    /// Amount returned to seller (after fees)
    pub payout: u128,

    /// Gross return before fees
    pub gross_return: u128,
}

/// Event emitted when tokens are claimed
#[event]
pub struct TokensClaimedEvent {
    /// Snapshot ID
    pub snapshot: Pubkey,

    /// Holder who claimed
    pub holder: Pubkey,

    /// Number of keys held
    pub keys_held: u64,

    /// Tokens claimed
    pub tokens_claimed: u64,

    /// Timestamp
    pub timestamp: i64,
}
