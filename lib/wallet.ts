// Mock $LAUNCH wallet using localStorage

const INITIAL_BALANCE = 1000
const BOOST_COST = 10
const STORAGE_KEY_BALANCE = 'launch-balance'
const STORAGE_KEY_BOOSTED = 'launch-boosted'

export function getBalance(): number {
  if (typeof window === 'undefined') return INITIAL_BALANCE

  const stored = localStorage.getItem(STORAGE_KEY_BALANCE)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_BALANCE, INITIAL_BALANCE.toString())
    return INITIAL_BALANCE
  }
  return parseInt(stored) || INITIAL_BALANCE
}

export function deductBalance(amount: number): boolean {
  if (typeof window === 'undefined') return false

  const current = getBalance()
  if (current < amount) return false

  localStorage.setItem(STORAGE_KEY_BALANCE, (current - amount).toString())
  return true
}

export function hasBoosted(projectId: string): boolean {
  if (typeof window === 'undefined') return false

  const boosted = JSON.parse(localStorage.getItem(STORAGE_KEY_BOOSTED) || '[]')
  return boosted.includes(projectId)
}

export function markBoosted(projectId: string): void {
  if (typeof window === 'undefined') return

  const boosted = JSON.parse(localStorage.getItem(STORAGE_KEY_BOOSTED) || '[]')
  if (!boosted.includes(projectId)) {
    localStorage.setItem(STORAGE_KEY_BOOSTED, JSON.stringify([...boosted, projectId]))
  }
}

export function getBoostCost(): number {
  return BOOST_COST
}

export function resetWallet(): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(STORAGE_KEY_BALANCE, INITIAL_BALANCE.toString())
  localStorage.setItem(STORAGE_KEY_BOOSTED, '[]')
}
