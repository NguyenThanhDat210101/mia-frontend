export interface Category {
  id: number;
  store_id: number;
  name: string;
  description?: string;
  image?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
  image?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryUpdateRequest extends Partial<CategoryCreateRequest> {}