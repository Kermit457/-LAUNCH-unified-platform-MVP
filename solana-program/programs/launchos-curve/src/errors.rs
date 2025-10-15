use anchor_lang::prelude::*;

#[error_code]
pub enum CurveError {
    #[msg("The curve is not yet active (pending creator buy)")]
    CurveNotActive,

    #[msg("Unauthorized: Only the creator can perform this action")]
    Unauthorized,

    #[msg("Invalid amount: Must be greater than zero")]
    InvalidAmount,

    #[msg("Amount exceeds maximum purchase limit")]
    ExceedsMaxPurchase,

    #[msg("Insufficient balance in reserve")]
    InsufficientReserve,

    #[msg("Creator must buy minimum keys first")]
    CreatorMinNotMet,

    #[msg("Keys are still locked")]
    KeysLocked,

    #[msg("Arithmetic overflow detected")]
    ArithmeticOverflow,

    #[msg("Reentrancy attack detected")]
    ReentrancyDetected,

    #[msg("This account is banned for bot activity")]
    AccountBanned,

    #[msg("Invalid curve status transition")]
    InvalidStatusTransition,

    #[msg("Price impact exceeds maximum allowed")]
    PriceImpactTooHigh,

    #[msg("Cannot sell during lock period")]
    SellLockActive,

    // Freeze & Launch Errors
    #[msg("Curve is already frozen")]
    AlreadyFrozen,

    #[msg("Curve is not frozen yet")]
    CurveNotFrozen,

    #[msg("Reserve threshold not met for auto-freeze")]
    ReserveThresholdNotMet,

    #[msg("Launch time not set for time-based freeze")]
    LaunchTimeNotSet,

    #[msg("Launch time not reached yet")]
    LaunchTimeNotReached,

    #[msg("Snapshot not created yet")]
    SnapshotNotCreated,

    #[msg("Snapshot already exists")]
    SnapshotAlreadyExists,

    #[msg("Curve already launched")]
    AlreadyLaunched,

    #[msg("Invalid Merkle proof")]
    InvalidMerkleProof,

    #[msg("Tokens already claimed")]
    AlreadyClaimed,

    #[msg("Invalid referrer address")]
    InvalidReferrer,

    #[msg("Cannot self-refer")]
    SelfReferral,

    #[msg("Exceeds maximum keys per wallet")]
    ExceedsMaxKeysPerWallet,

    #[msg("Trading is disabled in this state")]
    TradingDisabled,
}
