import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardStat, ActivityLog } from '../interfaces'

export const useAdminDashboardStore = defineStore('admin-dashboard', () => {
  const stats = ref<DashboardStat[]>([
    { label: 'Tổng cửa hàng', value: '1,284', icon: 'mdi-store', color: 'primary', trend: '+12%' },
    { label: 'Người dùng mới', value: '456', icon: 'mdi-account-plus', color: 'success', trend: '+5%' },
    { label: 'Doanh thu (tháng)', value: '$12,850', icon: 'mdi-currency-usd', color: 'warning', trend: '+8%' },
    { label: 'Giao dịch lỗi', value: '3', icon: 'mdi-alert-circle', color: 'error', trend: '-2%' },
  ])

  const activities = ref<ActivityLog[]>([
    { id: 1, title: 'Người dùng mới đăng ký', time: '2 phút trước' },
    { id: 2, title: 'Cửa hàng "Coffee Loft" được phê duyệt', time: '1 giờ trước' },
    { id: 3, title: 'Gói Pro được gia hạn bởi User #123', time: '3 giờ trước' },
    { id: 4, title: 'Cảnh báo hệ thống: Lỗi kết nối database', time: '5 giờ trước' },
    { id: 5, title: 'Cập nhật cấu hình hệ thống bởi Admin', time: '1 ngày trước' },
  ])

  return {
    stats,
    activities
  }
})
