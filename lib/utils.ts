import { ulid } from 'ulid'
import { createHash } from 'crypto'

export function generateId() {
  return ulid()
}

export function hashIp(ip: string): string {
  const day = new Date().toISOString().split('T')[0]
  return createHash('sha256').update(`${ip}:${day}`).digest('hex')
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'unknown'
}
