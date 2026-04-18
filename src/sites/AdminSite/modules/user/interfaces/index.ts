export interface AdminUser {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'editor' | 'viewer'
  last_login: string
}
