import { DashboardStat, ActivityLog } from '../interfaces'

export type StatColor = 'primary' | 'success' | 'warning' | 'error' | 'info'

export type DashboardData = {
  stats: DashboardStat[]
  activities: ActivityLog[]
}
