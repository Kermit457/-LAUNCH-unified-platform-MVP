# Bonding Curve Formula Comparison

## Formulas

### Original Spec (from CURVE_SPECIFICATION_FINAL_V4.md)
```
P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6
```

### Your Proposed Formula
```
P(S) = 0.08 + 0.0005*S + 0.0000020*S^1.6
```

## Component Breakdown

| Component | Original | Proposed | Change |
|-----------|----------|----------|--------|
| **Base Price** | 0.05 SOL | 0.08 SOL | +60% (0.03 SOL higher) |
| **Linear Coefficient** | 0.0003 | 0.0005 | +67% |
| **Exponential Coefficient** | 0.0000012 | 0.0000020 | +67% |

## Price Comparison at Key Supply Levels

### Manual Calculations (approximating S^1.6):

| Supply | Original P(S) | Proposed P(S) | Difference |
|--------|---------------|---------------|------------|
| **0** | 0.0500 SOL | 0.0800 SOL | +0.0300 SOL (+60%) |
| **10** | 0.0531 SOL | 0.0855 SOL | +0.0324 SOL (+61%) |
| **50** | 0.0664 SOL | 0.1090 SOL | +0.0426 SOL (+64%) |
| **100** | 0.0842 SOL | 0.1400 SOL | +0.0558 SOL (+66%) |
| **200** | 0.1239 SOL | 0.2095 SOL | +0.0856 SOL (+69%) |
| **300** | 0.1738 SOL | 0.2970 SOL | +0.1232 SOL (+71%) |
| **400** | 0.2320 SOL | 0.3997 SOL | +0.1677 SOL (+72%) |
| **500** | 0.2968 SOL | 0.5145 SOL | +0.2177 SOL (+73%) |

## Reserve Accumulation Estimate

To reach **32 SOL reserve**, we need to sum all individual key purchases.

### Rough Estimates:

**Original Formula:**
- Approximately **350-400 keys** needed to accumulate 32 SOL
- Final price per key: ~0.20-0.25 SOL

**Proposed Formula:**
- Approximately **220-260 keys** needed to accumulate 32 SOL
- Final price per key: ~0.30-0.40 SOL

### Impact:
- **~40% fewer keys needed** to reach launch threshold
- **~50% higher prices** throughout the curve

## Cost to Buy First 100 Keys

**Original Formula:** ~6-7 SOL total
**Proposed Formula:** ~11-12 SOL total

**Difference:** +70-80% more expensive

## Pros and Cons

### Original Formula (0.05 base)
✅ **Pros:**
- More accessible starting price (0.05 SOL)
- Allows more participants before launch
- Broader distribution (350-400 holders)
- Lower barrier to entry

❌ **Cons:**
- Takes longer to reach 32 SOL
- More diluted early adopters

### Proposed Formula (0.08 base)
✅ **Pros:**
- Faster launch (fewer keys needed)
- Better rewards for early adopters
- More exclusive holder base (220-260 holders)
- Steeper appreciation for early buyers

❌ **Cons:**
- Higher barrier to entry (0.08 SOL start)
- May discourage casual buyers
- Fewer total participants

## Recommendation

### **Use Original Formula (0.05 base)** if you want:
- Maximum accessibility
- Broader community participation
- More holders for token launch
- Lower friction for new users

### **Use Proposed Formula (0.08 base)** if you want:
- Faster launches
- More exclusive communities
- Better early adopter rewards
- Premium positioning

## My Suggestion

I recommend **starting with the ORIGINAL formula** (0.05 base) for these reasons:

1. **User Feedback First**: You can always increase steepness later based on data
2. **Lower Risk**: More accessible = more users trying the platform
3. **Better Distribution**: 350-400 holders is healthier for token launch than 220-260
4. **Competitive**: 0.05 SOL starting price is more competitive with other platforms

You can always deploy a V2 with steeper curves once you see how the market responds!

## Implementation Choice

**Which formula should I implement in the smart contract?**

Please let me know:
- **A) Original (0.05 base, 0.0003 linear, 0.0000012 exp)** ← Recommended
- **B) Proposed (0.08 base, 0.0005 linear, 0.0000020 exp)**
- **C) Custom (specify your own coefficients)**

Once you decide, I'll implement it in the `math.rs` module!
