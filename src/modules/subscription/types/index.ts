export interface Plan {
  id: number;
  name: string;
  slug: string;
  duration_months: number;
  price: number;
  is_free: boolean;
  is_popular: boolean;
  description: string[]; // This stores the features list from backend
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
