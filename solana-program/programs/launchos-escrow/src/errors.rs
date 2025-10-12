use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowError {
    #[msg("The escrow system is currently paused")]
    SystemPaused,

    #[msg("Insufficient balance in the pool")]
    InsufficientBalance,

    #[msg("Invalid amount: must be greater than 0")]
    InvalidAmount,

    #[msg("Pool is not in active status")]
    PoolNotActive,

    #[msg("Pool ID is invalid or too long (max 64 chars)")]
    InvalidPoolId,

    #[msg("Pool still has funds: must withdraw all before closing")]
    PoolNotEmpty,

    #[msg("Unauthorized: only the escrow authority can perform this action")]
    Unauthorized,

    #[msg("Pool not found")]
    PoolNotFound,

    #[msg("Mathematical overflow occurred")]
    MathOverflow,
}
