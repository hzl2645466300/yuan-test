export interface WorkOrder {
  id: string
  project: string
  overtime: boolean
  hours: number
  created_at: string
}

export interface SessionUser {
  username: string
  isAdmin: boolean
}
