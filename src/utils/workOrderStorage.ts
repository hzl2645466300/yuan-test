import { INITIAL_WORK_ORDERS } from '../data/initialMock'
import type { WorkOrder } from '../types/workOrder'

const ORDERS_KEY = 'ticket_demo_orders'

export function loadWorkOrders(): WorkOrder[] {
  const raw = sessionStorage.getItem(ORDERS_KEY)
  if (!raw) {
    persistWorkOrders(INITIAL_WORK_ORDERS)
    return [...INITIAL_WORK_ORDERS]
  }
  try {
    const parsed = JSON.parse(raw) as WorkOrder[]
    return Array.isArray(parsed) ? parsed : [...INITIAL_WORK_ORDERS]
  } catch {
    persistWorkOrders(INITIAL_WORK_ORDERS)
    return [...INITIAL_WORK_ORDERS]
  }
}

export function persistWorkOrders(orders: WorkOrder[]): void {
  sessionStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function resetWorkOrdersToMock(): void {
  persistWorkOrders(INITIAL_WORK_ORDERS)
}
