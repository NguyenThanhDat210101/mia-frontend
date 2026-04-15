import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  ReportFilters,
  ReportSummary,
  RevenueDataPoint,
  TopProduct,
  HourlyData,
  PaymentMethodStat,
  ReportPeriod,
} from '../types';

export const useReportStore = defineStore('report', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filters = ref<ReportFilters>({
    period: 'today',
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    storeId: '',
  });

  const summary = ref<ReportSummary | null>(null);
  const revenueChart = ref<RevenueDataPoint[]>([]);
  const topProducts = ref<TopProduct[]>([]);
  const hourlyDistribution = ref<HourlyData[]>([]);
  const paymentMethods = ref<PaymentMethodStat[]>([]);

  // ─── Computed ─────────────────────────────────────────────────────────────
  const hasData = computed(() => summary.value !== null);

  const formattedRevenue = computed(() =>
    summary.value
      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
          summary.value.totalRevenue,
        )
      : '0đ',
  );

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Cập nhật bộ lọc và tải lại dữ liệu */
  function setFilters(newFilters: Partial<ReportFilters>) {
    filters.value = { ...filters.value, ...newFilters };
    fetchReport();
  }

  /** Set nhanh period (today / 7days / 30days / custom) */
  function setPeriod(period: ReportPeriod) {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().substr(0, 10);

    let startDate = fmt(today);
    const endDate = fmt(today);

    if (period === '7days') {
      const d = new Date(today);
      d.setDate(d.getDate() - 6);
      startDate = fmt(d);
    } else if (period === '30days') {
      const d = new Date(today);
      d.setDate(d.getDate() - 29);
      startDate = fmt(d);
    }

    filters.value = { ...filters.value, period, startDate, endDate };
    fetchReport();
  }

  /** Tải dữ liệu báo cáo (mock — thay bằng API call thực tế) */
  async function fetchReport() {
    isLoading.value = true;
    error.value = null;

    try {
      // TODO: Thay bằng API call thực tế
      // const { data } = await apiClient.get('/reports', { params: filters.value });
      await _simulateFetch();
      _setMockData();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Đã có lỗi xảy ra';
    } finally {
      isLoading.value = false;
    }
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  function _simulateFetch(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1200));
  }

  function _setMockData() {
    summary.value = {
      totalRevenue: 18_450_000,
      totalOrders: 142,
      totalCustomers: 98,
      averageOrderValue: 129_930,
      revenueGrowth: 12.4,
      ordersGrowth: 8.7,
      customersGrowth: 5.2,
      avgOrderGrowth: 3.4,
    };

    revenueChart.value = [
      { label: 'T2', revenue: 2_100_000, orders: 17 },
      { label: 'T3', revenue: 3_400_000, orders: 26 },
      { label: 'T4', revenue: 1_800_000, orders: 14 },
      { label: 'T5', revenue: 4_200_000, orders: 32 },
      { label: 'T6', revenue: 2_950_000, orders: 23 },
      { label: 'T7', revenue: 5_100_000, orders: 39 },
      { label: 'CN', revenue: 3_700_000, orders: 28 },
    ];

    topProducts.value = [
      { id: '1', name: 'Cà phê sữa đá', quantity: 87, revenue: 2_610_000, percentage: 84 },
      { id: '2', name: 'Trà sữa truyền thống', quantity: 63, revenue: 2_205_000, percentage: 61 },
      { id: '3', name: 'Bạc xỉu', quantity: 54, revenue: 1_620_000, percentage: 52 },
      { id: '4', name: 'Matcha latte', quantity: 41, revenue: 1_845_000, percentage: 40 },
      { id: '5', name: 'Cà phê đen', quantity: 38, revenue: 950_000, percentage: 37 },
    ];

    hourlyDistribution.value = [
      { hour: '7h', orders: 8 },
      { hour: '8h', orders: 21 },
      { hour: '9h', orders: 18 },
      { hour: '10h', orders: 12 },
      { hour: '11h', orders: 9 },
      { hour: '12h', orders: 24 },
      { hour: '13h', orders: 19 },
      { hour: '14h', orders: 7 },
      { hour: '15h', orders: 11 },
      { hour: '16h', orders: 14 },
      { hour: '17h', orders: 22 },
      { hour: '18h', orders: 16 },
      { hour: '19h', orders: 10 },
      { hour: '20h', orders: 5 },
    ];

    paymentMethods.value = [
      { method: 'Tiền mặt', icon: 'mdi-cash', count: 78, revenue: 9_800_000, percentage: 53 },
      { method: 'Chuyển khoản', icon: 'mdi-bank-transfer', count: 42, revenue: 6_200_000, percentage: 34 },
      { method: 'Momo', icon: 'mdi-cellphone', count: 22, revenue: 2_450_000, percentage: 13 },
    ];
  }

  return {
    // state
    isLoading,
    error,
    filters,
    summary,
    revenueChart,
    topProducts,
    hourlyDistribution,
    paymentMethods,
    // computed
    hasData,
    formattedRevenue,
    // actions
    setFilters,
    setPeriod,
    fetchReport,
  };
});
