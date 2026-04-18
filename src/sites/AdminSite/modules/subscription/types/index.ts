export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string[];
  price: number;
  duration_months: number;
  is_active: boolean;
  is_popular: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PlanRequest {
  name: string;
  slug: string;
  description: string[];
  price: number;
  duration_months: number;
  is_active: boolean;
  is_popular: boolean;
}
