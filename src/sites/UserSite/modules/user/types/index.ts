export interface User {
  id: number;
  name: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  role_id: number;
  userInfo?: UserInfo;
  store?: Store;
  created_at?: string;
  updated_at?: string;
}

export interface UserInfo {
  id: number;
  user_id: number;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
}

export interface Store {
  id: number;
  name: string;
  address?: string;
  prefecture?: string;
  city?: string;
  phone?: string;
  email?: string;
  description?: string;
  avatar?: string;
  timezone?: string;
  opening_hours?: Array<{ day: string; open: string; close: string }>;
  is_active: boolean;
  is_setup_completed?: boolean;
}
