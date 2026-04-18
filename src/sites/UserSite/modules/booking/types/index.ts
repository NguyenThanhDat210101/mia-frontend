export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Booking {
  id: number;
  store_id: number;
  user_id?: number;
  user_name: string;
  phone: string;
  email?: string;
  coupon_code?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BookingDetail {
  id: number;
  booking_id: number;
  service_id: number;
  service_name: string;
  price: number;
  quantity: number;
}
