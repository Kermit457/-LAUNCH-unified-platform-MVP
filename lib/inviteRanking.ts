import { Invite } from './types'

// Normalize value to 0..1 range
function normalize(value: number, max: number): number {
  return Math.min(Math.max(value / max, 0), 1)
}

// Compute invite priority score
export function computeInvitePriority(
  invite: Invite,
  myRoles: string[],
  maxMutuals: number = 10,
  maxConviction: number = 100
): number {
  // Normalize mutuals (0-10+ range)
  const mutuals_norm = normalize(invite.mutuals, maxMutuals)

  // Role match: check if invite role matches any of my roles
  const role_match = invite.role && myRoles.includes(invite.role) ? 1 : 0

  // Recent norm: newer invites score higher (within last 7 days)
  const ageMs = Date.now() - invite.sentAt
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  const recent_norm = normalize(7 - ageDays, 7)

  // Verified: 1 if sender is verified, 0 otherwise
  const verified = 0 // TODO: lookup sender verification status

  // Conviction: placeholder, would need sender's conviction score
  const conviction_norm = 0.7 // mock value

  const priority =
    0.35 * mutuals_norm +
    0.25 * role_match +
    0.2 * recent_norm +
    0.1 * verified +
    0.1 * conviction_norm

  return Math.round(priority * 100) / 100 // round to 2 decimals
}

// Rank invites by priority
export function rankInvites(invites: Invite[], myRoles: string[]): Invite[] {
  return invites
    .map(inv => ({
      ...inv,
      priority: computeInvitePriority(inv, myRoles)
    }))
    .sort((a, b) => b.priority - a.priority)
}
