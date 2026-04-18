export interface Store {
  id: number
  user_id: number
  name: string
  type?: string
  address?: string
  phone?: string
  email?: string
  is_active: boolean
  is_setup_completed: boolean
  created_at: string
  updated_at: string
  manager?: {
    id: number
    name: string
    email: string
  }
  active_plan?: {
    id: number
    name: string
    slug: string
  }
}

export interface StoreResponse {
  data: Store[]
  message?: string
}

export interface SingleStoreResponse {
  data: Store
  message?: string
}

export interface StoreFilter {
  search: string
  status: string
}
