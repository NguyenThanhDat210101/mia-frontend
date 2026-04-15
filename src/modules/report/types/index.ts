export type ReportPeriod = 'today' | '7days' | '30days' | 'custom';

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

export interface ReportSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;   // % so sánh kỳ trước
  ordersGrowth: number;
  customersGrowth: number;
  avgOrderGrowth: number;
}

export interface HourlyData {
  hour: string;
  orders: number;
}

export interface PaymentMethodStat {
  method: string;
  icon: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface ReportFilters {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  storeId: string;
}

export interface ReportState {
  filters: ReportFilters;
  summary: ReportSummary | null;
  revenueChart: RevenueDataPoint[];
  topProducts: TopProduct[];
  hourlyDistribution: HourlyData[];
  paymentMethods: PaymentMethodStat[];
  isLoading: boolean;
  error: string | null;
}
