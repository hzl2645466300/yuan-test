import type { SessionUser } from '../types/workOrder'

const USER_KEY = 'ticket_demo_user'

export function saveSessionUser(user: SessionUser): void {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function readSessionUser(): SessionUser | null {
  const raw = sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function clearSessionUser(): void {
  sessionStorage.removeItem(USER_KEY)
}

export function isAdminUsername(username: string): boolean {
  return username.trim() === 'admin'
}
