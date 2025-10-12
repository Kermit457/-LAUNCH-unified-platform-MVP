use anchor_lang::prelude::*;

/// Master escrow account that manages all pools
#[account]
#[derive(InitSpace)]
pub struct EscrowAccount {
    /// Authority that can manage the escrow system
    pub authority: Pubkey,
    /// Total number of pools created
    pub total_pools: u64,
    /// Total value locked across all pools (in lamports/smallest unit)
    pub total_value_locked: u64,
    /// Emergency pause flag
    pub paused: bool,
    /// Bump seed for PDA
    pub bump: u8,
}

/// Individual escrow pool for a specific use case
#[account]
#[derive(InitSpace)]
pub struct Pool {
    /// Unique identifier for the pool (e.g., "boost_pool", "campaign_123")
    #[max_len(64)]
    pub pool_id: String,
    /// Type of pool
    pub pool_type: PoolType,
    /// Optional owner ID (e.g., campaign ID, quest ID)
    #[max_len(64)]
    pub owner_id: Option<String>,
    /// Current balance in the pool
    pub balance: u64,
    /// Total amount ever deposited
    pub total_deposited: u64,
    /// Total amount ever withdrawn
    pub total_withdrawn: u64,
    /// Pool status
    pub status: PoolStatus,
    /// Timestamp when pool was created
    pub created_at: i64,
    /// Bump seed for PDA
    pub bump: u8,
    /// Token account that holds the actual USDC
    pub pool_token_account: Pubkey,
}

/// Types of escrow pools
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum PoolType {
    /// Boost payments (10 USDC per boost)
    Boost,
    /// Campaign budgets (variable amounts)
    Campaign,
    /// Quest rewards (variable amounts)
    Quest,
    /// Launch contribution pools
    Contribution,
    /// Platform revenue sharing
    Revenue,
    /// General payouts
    Payout,
}

/// Status of an escrow pool
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum PoolStatus {
    /// Pool is active and accepting deposits/withdrawals
    Active,
    /// Pool is closed (no more operations allowed)
    Closed,
}

impl std::fmt::Debug for PoolType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PoolType::Boost => write!(f, "Boost"),
            PoolType::Campaign => write!(f, "Campaign"),
            PoolType::Quest => write!(f, "Quest"),
            PoolType::Contribution => write!(f, "Contribution"),
            PoolType::Revenue => write!(f, "Revenue"),
            PoolType::Payout => write!(f, "Payout"),
        }
    }
}
