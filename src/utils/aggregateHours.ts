import type { WorkOrder } from '../types/workOrder'

export interface ProjectHours {
  project: string
  hours: number
}

/** 按项目名称汇总累计工时 */
export function aggregateHoursByProject(orders: WorkOrder[]): ProjectHours[] {
  const map = new Map<string, number>()
  for (const row of orders) {
    map.set(row.project, (map.get(row.project) ?? 0) + row.hours)
  }
  return Array.from(map.entries()).map(([project, hours]) => ({
    project,
    hours: Math.round(hours * 10) / 10,
  }))
}
