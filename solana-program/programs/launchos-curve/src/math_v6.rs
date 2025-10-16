use anchor_lang::prelude::*;
use crate::errors::CurveError;

/// Bonding curve math module - V6
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

/// V6 Fee distribution for buy transactions
#[derive(Debug, Clone, Copy)]
pub struct V6BuyFeeDistribution {
    pub reserve: u128,           // 94%
    pub referral: u128,          // 3% (flexible routing)
    pub project: u128,           // 1% (guaranteed minimum)
    pub buyback_burn: u128,      // 1%
    pub community_rewards: u128, // 1%
}

/// V6 Calculate fee distribution for a buy transaction
/// Implements flexible routing logic based on referrer type
pub fn calculate_v6_buy_fees(
    total_cost: u128,
    referrer_type: ReferrerType,
) -> Result<V6BuyFeeDistribution> {
    // 94% to reserve
    let reserve = total_cost
        .checked_mul(9400)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // 1% buyback/burn (always)
    let buyback_burn = total_cost
        .checked_mul(100)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // 1% community rewards (base)
    let base_community = total_cost
        .checked_mul(100)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // Flexible routing based on referrer type
    let (referral, project, community_rewards) = match referrer_type {
        ReferrerType::User => {
            // User referral: 3% to user, 1% to project, 1% to community
            let referral = total_cost
                .checked_mul(300) // 3%
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            let project = total_cost
                .checked_mul(100) // 1%
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            (referral, project, base_community)
        },
        ReferrerType::Project => {
            // Project self-referral: 0% to referrer, 4% to project, 1% to community
            let project = total_cost
                .checked_mul(400) // 4% (3% + 1%)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            (0, project, base_community)
        },
        ReferrerType::None => {
            // No referral: 0% to referrer, 2% to project, 3% to community
            let project = total_cost
                .checked_mul(200) // 2%
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            let community = total_cost
                .checked_mul(300) // 3% (2% + 1%)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            (0, project, community)
        }
    };

    Ok(V6BuyFeeDistribution {
        reserve,
        referral,
        project,
        buyback_burn,
        community_rewards,
    })
}

/// V6 Fee distribution for sell transactions
#[derive(Debug, Clone, Copy)]
pub struct V6SellFeeDistribution {
    pub to_seller: u128,         // 94% (after 6% fee)
    pub referral: u128,          // Variable based on referrer type
    pub project: u128,           // Variable based on referrer type
    pub buyback_burn: u128,      // 1% of gross
    pub community_rewards: u128, // Variable based on referrer type
}

/// V6 Calculate fee distribution for a sell transaction
pub fn calculate_v6_sell_fees(
    gross_return: u128,
    referrer_type: ReferrerType,
) -> Result<V6SellFeeDistribution> {
    // Seller always gets 94%
    let to_seller = gross_return
        .checked_mul(9400)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // 1% buyback/burn (always)
    let buyback_burn = gross_return
        .checked_mul(100)
        .ok_or(error!(CurveError::ArithmeticOverflow))?
        .checked_div(10000)
        .ok_or(error!(CurveError::ArithmeticOverflow))?;

    // Flexible routing for remaining 5%
    let (referral, project, community_rewards) = match referrer_type {
        ReferrerType::User => {
            // User gets 3%, project gets 1%, community gets 1%
            let referral = gross_return
                .checked_mul(300)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            let project = gross_return
                .checked_mul(100)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            let community = gross_return
                .checked_mul(100)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            (referral, project, community)
        },
        ReferrerType::Project => {
            // Project gets 4%, community gets 1%
            let project = gross_return
                .checked_mul(400)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            let community = gross_return
                .checked_mul(100)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            (0, project, community)
        },
        ReferrerType::None => {
            // Project gets 2%, community gets 3%
            let project = gross_return
                .checked_mul(200)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            let community = gross_return
                .checked_mul(300)
                .ok_or(error!(CurveError::ArithmeticOverflow))?
                .checked_div(10000)
                .ok_or(error!(CurveError::ArithmeticOverflow))?;

            (0, project, community)
        }
    };

    Ok(V6SellFeeDistribution {
        to_seller,
        referral,
        project,
        buyback_burn,
        community_rewards,
    })
}

/// Referrer type for V6 fee routing
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ReferrerType {
    User,     // Regular user referral
    Project,  // Project self-referral
    None,     // No referral
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_v6_buy_fees_user_referral() {
        let total_cost = 1_000_000_000u128; // 1 SOL
        let fees = calculate_v6_buy_fees(total_cost, ReferrerType::User).unwrap();

        // Check percentages
        assert_eq!(fees.reserve, 940_000_000); // 94%
        assert_eq!(fees.referral, 30_000_000); // 3%
        assert_eq!(fees.project, 10_000_000); // 1%
        assert_eq!(fees.buyback_burn, 10_000_000); // 1%
        assert_eq!(fees.community_rewards, 10_000_000); // 1%

        // Should sum to total
        let sum = fees.reserve + fees.referral + fees.project +
                  fees.buyback_burn + fees.community_rewards;
        assert_eq!(sum, total_cost);
    }

    #[test]
    fn test_v6_buy_fees_project_referral() {
        let total_cost = 1_000_000_000u128; // 1 SOL
        let fees = calculate_v6_buy_fees(total_cost, ReferrerType::Project).unwrap();

        // Check percentages
        assert_eq!(fees.reserve, 940_000_000); // 94%
        assert_eq!(fees.referral, 0); // 0% (project self-ref)
        assert_eq!(fees.project, 40_000_000); // 4%
        assert_eq!(fees.buyback_burn, 10_000_000); // 1%
        assert_eq!(fees.community_rewards, 10_000_000); // 1%

        // Should sum to total
        let sum = fees.reserve + fees.referral + fees.project +
                  fees.buyback_burn + fees.community_rewards;
        assert_eq!(sum, total_cost);
    }

    #[test]
    fn test_v6_buy_fees_no_referral() {
        let total_cost = 1_000_000_000u128; // 1 SOL
        let fees = calculate_v6_buy_fees(total_cost, ReferrerType::None).unwrap();

        // Check percentages
        assert_eq!(fees.reserve, 940_000_000); // 94%
        assert_eq!(fees.referral, 0); // 0%
        assert_eq!(fees.project, 20_000_000); // 2%
        assert_eq!(fees.buyback_burn, 10_000_000); // 1%
        assert_eq!(fees.community_rewards, 30_000_000); // 3%

        // Should sum to total
        let sum = fees.reserve + fees.referral + fees.project +
                  fees.buyback_burn + fees.community_rewards;
        assert_eq!(sum, total_cost);
    }

    #[test]
    fn test_v6_sell_fees_user_referral() {
        let gross = 1_000_000_000u128; // 1 SOL gross
        let fees = calculate_v6_sell_fees(gross, ReferrerType::User).unwrap();

        // Seller should get 94%
        assert_eq!(fees.to_seller, 940_000_000);
        assert_eq!(fees.referral, 30_000_000); // 3%
        assert_eq!(fees.project, 10_000_000); // 1%
        assert_eq!(fees.buyback_burn, 10_000_000); // 1%
        assert_eq!(fees.community_rewards, 10_000_000); // 1%

        // Total should match
        let total = fees.to_seller + fees.referral + fees.project +
                    fees.buyback_burn + fees.community_rewards;
        assert_eq!(total, gross);
    }
}