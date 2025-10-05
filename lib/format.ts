import { Money } from './types'

export const fmtUSDC = (n: number) => `$${n.toFixed(2)}`
export const fmtSOL = (n: number) => `${n.toFixed(3)} SOL`
export const fmtMoney = (m: Money) => m.mint === "USDC" ? fmtUSDC(m.amount) : fmtSOL(m.amount)