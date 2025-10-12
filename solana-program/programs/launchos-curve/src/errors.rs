use anchor_lang::prelude::*;

#[error_code]
pub enum CurveError {
    #[msg("The curve is currently paused")]
    CurvePaused,

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
}
