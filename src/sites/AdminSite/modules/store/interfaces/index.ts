export interface Store {
  id: number
  name: string
  owner_name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
}

export interface StoreFilter {
  search: string
  status: string
}
