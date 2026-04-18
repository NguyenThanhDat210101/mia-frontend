import { storeToRefs } from 'pinia'
import { useAdminDashboardStore } from '../store/dashboard.store'

export function useDashboard() {
  const store = useAdminDashboardStore()
  const { stats, activities } = storeToRefs(store)

  const refreshStats = async () => {
    // Logic to refresh stats from API
    console.log('Refreshing dashboard stats...')
  }

  return {
    stats,
    activities,
    refreshStats
  }
}
