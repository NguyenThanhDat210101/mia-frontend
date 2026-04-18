export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  userInfo?: UserInfo;
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
