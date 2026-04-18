export interface DashboardStat {
  label: string
  value: string | number
  icon: string
  color: string
  trend: string
}

export interface ActivityLog {
  id: number
  title: string
  time: string
}
