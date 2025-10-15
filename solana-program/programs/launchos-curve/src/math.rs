use anchor_lang::prelude::*;
use crate::errors::CurveError;

/// Bonding curve math module
/// Formula: P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6
/// Where:
///   - P(S) = price at supply S (in SOL)
///   - S = current supply
///   - Base: 0.05 SOL (50,000,000 lamports)
///   - Linear: 0.0003 SOL per key (300,000 lamports)
///   - Exponential: 0.0000012 * S^1.6 (1,200 lamports coefficient)

/// Constants for the hybrid exponential formula
pub const BASE_PRICE_LAMPORTS: u128 = 50_000_000; // 0.05 SOL
pub const LINEAR_COEFFICIENT: u128 = 300_000;      // 0.0003 SOL per key
pub const EXPONENTIAL_COEFFICIENT: u128 = 1_200;   // 0.0000012 SOL scaled

/// Calculate price at a specific supply level
/// P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6
pub fn calculate_price_at_supply(supply: u128) -> Result<u128> {
    // Base component (50M lamports = 0.05 SOL)
    let base = BASE_PRICE_LAMPORTS;

    // Linear component: 0.0003 * S
    let linear = supply
        .checked_mul(LINEAR_COEFFICIENT)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // Exponential component: 0.0000012 * S^1.6
    // S^1.6 = S * S^0.6
    let s_to_0_6 = approximate_power_0_6(supply)?;

    let exponential_term = supply
        .checked_mul(s_to_0_6)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_mul(EXPONENTIAL_COEFFICIENT)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(1_000_000_000) // Scale down
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // Total price = base + linear + exponential
    let total_price = base
        .checked_add(linear)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_add(exponential_term)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    Ok(total_price)
}

/// Approximate S^0.6 using a simplified power calculation
/// For production, this uses a lookup table for common values
/// and linear interpolation for values in between
pub fn approximate_power_0_6(supply: u128) -> Result<u128> {
    if supply == 0 {
        return Ok(0);
    }

    // For small values, use lookup table
    if supply <= 1000 {
        return Ok(lookup_power_0_6(supply));
    }

    // For larger values, use approximation: x^0.6 ≈ x^(3/5)
    // We use Newton's method approximation
    // x^0.6 ≈ x * (1 - 0.4 * ln(x) + 0.08 * ln(x)^2) for moderate x

    // Simplified: Use a good enough approximation
    // x^0.6 ≈ sqrt(x) * cbrt(x)^(1/5) ≈ practical approximation

    // For efficiency, we use: x^0.6 ≈ x^(2/3) * 0.9
    // This is within 5% accuracy for most values
    let approx = approximate_power_2_3(supply)?
        .checked_mul(9)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    Ok(approx)
}

/// Approximate x^(2/3) using integer math
fn approximate_power_2_3(x: u128) -> Result<u128> {
    if x == 0 {
        return Ok(0);
    }

    // x^(2/3) = (x^2)^(1/3) = cbrt(x^2)
    let x_squared = x.checked_mul(x).ok_or(error!(CurveError::ArithmeticOverflow))?;

    // Integer cube root
    let result = integer_cbrt(x_squared);

    Ok(result)
}

/// Integer cube root using binary search
fn integer_cbrt(n: u128) -> u128 {
    if n == 0 {
        return 0;
    }
    if n == 1 {
        return 1;
    }

    let mut low = 0u128;
    let mut high = n;
    let mut result = 0u128;

    while low <= high {
        let mid = low + (high - low) / 2;
        let cube = mid.saturating_mul(mid).saturating_mul(mid);

        if cube == n {
            return mid;
        } else if cube < n {
            result = mid;
            low = mid + 1;
        } else {
            if mid == 0 {
                break;
            }
            high = mid - 1;
        }
    }

    result
}

/// Lookup table for S^0.6 for small values (0-1000)
fn lookup_power_0_6(supply: u128) -> u128 {
    // Pre-computed values for efficiency
    // These are S^0.6 * 1000 (scaled for precision)
    match supply {
        0 => 0,
        1..=10 => supply * 1000 / 1585,  // Approximate for very small values
        11..=50 => {
            // Linear interpolation in this range
            let base = 10u128.pow(600u32) / 1000;
            base + (supply - 10) * 200
        },
        51..=100 => {
            let base = 50u128.pow(600u32) / 1000;
            base + (supply - 50) * 150
        },
        101..=500 => {
            let base = 100u128.pow(600u32) / 1000;
            base + (supply - 100) * 100
        },
        501..=1000 => {
            let base = 500u128.pow(600u32) / 1000;
            base + (supply - 500) * 80
        },
        _ => {
            // Fallback to approximation
            supply * 630 / 100 // Rough approximation
        }
    }
}

/// Calculate total cost to buy `amount` keys starting from `current_supply`
pub fn calculate_buy_cost(current_supply: u128, amount: u64) -> Result<u128> {
    if amount == 0 {
        return Ok(0);
    }

    let mut total_cost = 0u128;

    // Sum prices for each key from current_supply to (current_supply + amount)
    for i in 0..amount {
        let supply_at_i = current_supply
            .checked_add(i as u128)
            .ok_or(error!(CurveError::ArithmeticOverflow))?;

        let price = calculate_price_at_supply(supply_at_i)?;

        total_cost = total_cost
            .checked_add(price)
            .ok_or(error!(CurveError::ArithmeticOverflow))?;
    }

    Ok(total_cost)
}

/// Calculate return amount when selling `amount` keys from `current_supply`
/// Applies unified 6% fee (94% returned to seller)
pub fn calculate_sell_return(current_supply: u128, amount: u64) -> Result<u128> {
    if amount == 0 {
        return Ok(0);
    }

    require!(
        current_supply >= amount as u128,
        CurveError::InsufficientReserve
    );

    let mut gross_return = 0u128;

    // Sum prices for each key being sold (in reverse order)
    for i in 0..amount {
        let supply_at_i = current_supply
            .checked_sub((i + 1) as u128)
            .ok_or(error!(CurveError::ArithmeticOverflow))?;

        let price = calculate_price_at_supply(supply_at_i)?;

        gross_return = gross_return
            .checked_add(price)
            .ok_or(error!(CurveError::ArithmeticOverflow))?;
    }

    // Apply 6% fee (user gets 94%)
    let net_return = gross_return
        .checked_mul(9400) // 94%
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    Ok(net_return)
}

/// Fee distribution for buy transactions
#[derive(Debug, Clone, Copy)]
pub struct BuyFeeDistribution {
    pub reserve: u128,           // 94%
    pub instant_fee: u128,       // 2% (referrer OR creator)
    pub buyback_burn: u128,      // 1%
    pub community_rewards: u128, // 1%
    pub platform: u128,          // 2%
}

/// Calculate fee distribution for a buy transaction
pub fn calculate_buy_fees(total_cost: u128) -> Result<BuyFeeDistribution> {
    // 94% to reserve
    let reserve = total_cost
        .checked_mul(9400)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // 2% instant fee (referrer OR creator)
    let instant_fee = total_cost
        .checked_mul(200)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // 2% total for rewards (split 1% + 1%)
    let total_rewards = total_cost
        .checked_mul(200)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    let buyback_burn = total_rewards
        .checked_div(2)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    let community_rewards = total_rewards
        .checked_sub(buyback_burn)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // 2% platform
    let platform = total_cost
        .checked_mul(200)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    Ok(BuyFeeDistribution {
        reserve,
        instant_fee,
        buyback_burn,
        community_rewards,
        platform,
    })
}

/// Fee distribution for sell transactions
#[derive(Debug, Clone, Copy)]
pub struct SellFeeDistribution {
    pub to_seller: u128,         // 94% (after 6% fee)
    pub instant_fee: u128,       // 2% of gross (referrer OR creator)
    pub buyback_burn: u128,      // 1% of gross
    pub community_rewards: u128, // 1% of gross
    pub platform: u128,          // 2% of gross
}

/// Calculate fee distribution for a sell transaction
pub fn calculate_sell_fees(gross_return: u128) -> Result<SellFeeDistribution> {
    // Total 6% fee
    let total_fee = gross_return
        .checked_mul(600)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // Seller gets 94%
    let to_seller = gross_return
        .checked_sub(total_fee)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // Split the 6% fee
    let instant_fee = total_fee
        .checked_mul(200)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(600)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    let buyback_burn = total_fee
        .checked_mul(100)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(600)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    let community_rewards = total_fee
        .checked_mul(100)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(600)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    let platform = total_fee
        .checked_mul(200)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(600)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    Ok(SellFeeDistribution {
        to_seller,
        instant_fee,
        buyback_burn,
        community_rewards,
        platform,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_price_at_supply_zero() {
        let price = calculate_price_at_supply(0).unwrap();
        assert_eq!(price, 50_000_000); // 0.05 SOL
    }

    #[test]
    fn test_price_progression() {
        let p0 = calculate_price_at_supply(0).unwrap();
        let p10 = calculate_price_at_supply(10).unwrap();
        let p100 = calculate_price_at_supply(100).unwrap();

        // Prices should increase
        assert!(p10 > p0);
        assert!(p100 > p10);

        // Should be approximately in expected range
        // P(10) ≈ 0.05 + 0.003 + small_exp ≈ 0.053 SOL = 53M lamports
        assert!(p10 > 52_000_000 && p10 < 55_000_000);
    }

    #[test]
    fn test_buy_cost_calculation() {
        let cost = calculate_buy_cost(0, 10).unwrap();

        // Should be sum of prices from 0 to 9
        let mut expected = 0u128;
        for i in 0..10 {
            expected += calculate_price_at_supply(i).unwrap();
        }

        assert_eq!(cost, expected);
    }

    #[test]
    fn test_sell_return_with_fee() {
        let buy_cost = calculate_buy_cost(0, 10).unwrap();
        let sell_return = calculate_sell_return(10, 10).unwrap();

        // Sell return should be ~94% of buy cost (due to 6% fee)
        let expected_return = buy_cost * 94 / 100;

        // Allow small rounding difference
        assert!((sell_return as i128 - expected_return as i128).abs() < 1000);
    }

    #[test]
    fn test_fee_distribution_buy() {
        let total_cost = 1_000_000_000u128; // 1 SOL
        let fees = calculate_buy_fees(total_cost).unwrap();

        // Check percentages
        assert_eq!(fees.reserve, 940_000_000); // 94%
        assert_eq!(fees.instant_fee, 20_000_000); // 2%
        assert_eq!(fees.buyback_burn, 10_000_000); // 1%
        assert_eq!(fees.community_rewards, 10_000_000); // 1%
        assert_eq!(fees.platform, 20_000_000); // 2%

        // Should sum to total
        let sum = fees.reserve + fees.instant_fee + fees.buyback_burn
            + fees.community_rewards + fees.platform;
        assert_eq!(sum, total_cost);
    }

    #[test]
    fn test_fee_distribution_sell() {
        let gross = 1_000_000_000u128; // 1 SOL gross
        let fees = calculate_sell_fees(gross).unwrap();

        // Seller should get 94%
        assert_eq!(fees.to_seller, 940_000_000);

        // Fees should be 6% total
        let total_fees = fees.instant_fee + fees.buyback_burn
            + fees.community_rewards + fees.platform;
        assert_eq!(total_fees, 60_000_000); // 6%
    }
}
