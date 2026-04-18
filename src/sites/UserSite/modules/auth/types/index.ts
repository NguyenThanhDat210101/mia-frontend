export interface User {
  id: number
  name: string
  email: string
  role?: {
    id: number
    name: string
  }
  role_id: number
  created_at?: string
  updated_at?: string
  store?: {
    id: number
    name: string
    is_setup_completed: boolean
    active_plan?: {
      id: number
      name: string
      slug: string
    } | null
  }
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: User
}

export interface LoginResponse {
  data: AuthResponse
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface RegisterResponse {
  data: AuthResponse
  message?: string
}
