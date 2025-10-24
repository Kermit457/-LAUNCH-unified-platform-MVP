# ICM Motion - Solana Launch Platform v4

## Stack
Next.js 14 + Anchor + @solana/web3.js v4 + Privy + Appwrite

## Project Structure
```
widgets-for-launch/
├── app/                          # Next.js 14 App Router
├── .claude/
│   ├── agents/                  # Specialized agents
│   └── commands/                # Slash commands
├── contexts/
│   └── PrivyProviderWrapper.tsx # ⚠️ CRITICAL - Privy config
├── lib/
│   ├── solana/                  # Solana utilities
│   ├── appwrite/                # Backend services
│   └── validations/             # Zod schemas
├── solana-program/              # Anchor contracts
│   ├── programs/curve/src/      # Bonding curve program
│   └── target/idl/              # Generated IDLs
└── scripts/                     # Deploy & utils
```

## Commands
```bash
# Anchor
cd "c:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"
anchor build && anchor deploy
./copy-idl.ps1

# Frontend
npm run dev
npm run build
Remove-Item -Recurse -Force .next
ANALYZE=true npm run build

# Testing
anchor test
npm test
tsc --noEmit
```

## Architecture Notes
- **Bonding curve:** Per-user PDAs, init → trade → freeze → LP → launch
- **Program ID:** See DEPLOYMENT_STATUS.md
- **Fees:** 3% Referral, 1% Project, 1% Buyback, 1% Community
- **Anti-sniper:** Freeze period before LP seeding
- **Auth:** Privy embedded + external wallets (Phantom, Backpack)

## Critical Paths
- `contexts/PrivyProviderWrapper.tsx` - ⚠️ Wallet config
- `lib/solana/` - Instruction builders & utilities
- `hooks/useSolanaBuyKeys.ts` - Transaction signing
- `solana-program/programs/curve/src/` - Core program logic

## Available Tools
- **Agents:** `.claude/agents/` (13 specialized agents)
- **Commands:** `.claude/commands/` (8 slash commands)
- **Templates:** `.claude/templates/PLAN_TEMPLATE.md`

## Quick Fixes
- **"Loading chunk failed"** → Clear `.next`
- **"No RPC configuration"** → Check `PrivyProviderWrapper`
- **Bundle too large** → `ANALYZE=true npm run build`
- **TypeScript errors** → `tsc --noEmit`

## Doc Index
- [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) - Live program IDs, environment
- [SPRINT.md](./SPRINT.md) - Current work & priorities
- [DOCS_INDEX.md](./DOCS_INDEX.md) - Full documentation map
- [SOLANA_ARCHITECTURE_V3_FINAL.md](./SOLANA_ARCHITECTURE_V3_FINAL.md) - System design
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Frontend integration

## Current State
See: DEPLOYMENT_STATUS.md | SPRINT.md

---

**Context:** Memory handles preferences & work style | Docs handle architecture & state
