#!/usr/bin/env python3
"""
Compare two bonding curve formulas to see price progression and 32 SOL target
"""

import math

def formula_original(S):
    """Original spec: P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6"""
    return 0.05 + 0.0003 * S + 0.0000012 * (S ** 1.6)

def formula_proposed(S):
    """Proposed: P(S) = 0.08 + 0.0005*S + 0.0000020*S^1.6"""
    return 0.08 + 0.0005 * S + 0.0000020 * (S ** 1.6)

def calculate_total_cost(formula_func, start_supply, end_supply):
    """Calculate total cost to buy from start_supply to end_supply"""
    total = 0
    for i in range(start_supply, end_supply):
        total += formula_func(i)
    return total

def find_supply_for_target(formula_func, target_reserve=32.0):
    """Find approximate supply needed to reach target reserve"""
    supply = 0
    total_cost = 0
    step = 10  # Check every 10 keys

    while total_cost < target_reserve and supply < 10000:
        cost_for_next_batch = calculate_total_cost(formula_func, supply, supply + step)
        if total_cost + cost_for_next_batch > target_reserve:
            # Fine-tune
            for i in range(supply, supply + step):
                price = formula_func(i)
                if total_cost + price > target_reserve:
                    return i, total_cost
                total_cost += price
            return supply + step, total_cost
        else:
            total_cost += cost_for_next_batch
            supply += step

    return supply, total_cost

print("=" * 80)
print("BONDING CURVE FORMULA COMPARISON")
print("=" * 80)
print()

# Test key supply points
test_supplies = [0, 10, 50, 100, 200, 300, 400, 500, 750, 1000]

print("Price at Various Supply Levels:")
print("-" * 80)
print(f"{'Supply':<10} {'Original (SOL)':<20} {'Proposed (SOL)':<20} {'Difference':<20}")
print("-" * 80)

for supply in test_supplies:
    original = formula_original(supply)
    proposed = formula_proposed(supply)
    diff = proposed - original
    diff_pct = (diff / original * 100) if original > 0 else 0

    print(f"{supply:<10} {original:<20.6f} {proposed:<20.6f} +{diff:.6f} (+{diff_pct:.1f}%)")

print()
print("=" * 80)
print("RESERVE TARGET ANALYSIS (32 SOL)")
print("=" * 80)
print()

# Find supply needed to reach 32 SOL
original_supply, original_reserve = find_supply_for_target(formula_original, 32.0)
proposed_supply, proposed_reserve = find_supply_for_target(formula_proposed, 32.0)

print(f"Original Formula:")
print(f"  - Supply needed: ~{original_supply} keys")
print(f"  - Reserve reached: {original_reserve:.4f} SOL")
print()

print(f"Proposed Formula:")
print(f"  - Supply needed: ~{proposed_supply} keys")
print(f"  - Reserve reached: {proposed_reserve:.4f} SOL")
print()

reduction = original_supply - proposed_supply
reduction_pct = (reduction / original_supply * 100) if original_supply > 0 else 0

print(f"Impact: Reaches 32 SOL with {reduction} FEWER keys ({reduction_pct:.1f}% reduction)")
print()

# Calculate total cost for buying first 100 keys
print("=" * 80)
print("COST ANALYSIS: First 100 Keys")
print("=" * 80)
print()

cost_original_100 = calculate_total_cost(formula_original, 0, 100)
cost_proposed_100 = calculate_total_cost(formula_proposed, 0, 100)

print(f"Original Formula: {cost_original_100:.4f} SOL")
print(f"Proposed Formula: {cost_proposed_100:.4f} SOL")
print(f"Difference: +{cost_proposed_100 - cost_original_100:.4f} SOL (+{((cost_proposed_100/cost_original_100 - 1) * 100):.1f}%)")
print()

# Show price at target supply
print("=" * 80)
print("PRICE PER KEY AT 32 SOL THRESHOLD")
print("=" * 80)
print()

price_original_at_target = formula_original(original_supply)
price_proposed_at_target = formula_proposed(proposed_supply)

print(f"Original Formula: {price_original_at_target:.6f} SOL per key (at supply {original_supply})")
print(f"Proposed Formula: {price_proposed_at_target:.6f} SOL per key (at supply {proposed_supply})")
print()

print("=" * 80)
print("RECOMMENDATION")
print("=" * 80)
print()

print("Key Differences:")
print(f"1. Base Price: 0.05 → 0.08 SOL (+60% starting price)")
print(f"2. Linear Coefficient: 0.0003 → 0.0005 (+67% linear growth)")
print(f"3. Exponential Coefficient: 0.0000012 → 0.0000020 (+67% exponential growth)")
print()
print("Effect:")
print(f"- Steeper curve = reaches 32 SOL faster")
print(f"- Higher prices earlier = better for early sellers")
print(f"- Fewer keys needed for launch = more exclusive")
print()

if reduction_pct > 20:
    print("⚠️  WARNING: Proposed formula is SIGNIFICANTLY steeper")
    print("   This may make it too expensive for regular users")
elif reduction_pct > 10:
    print("✅ BALANCED: Proposed formula is moderately steeper")
    print("   Good balance between accessibility and launch speed")
else:
    print("ℹ️  SIMILAR: Formulas are relatively close")
