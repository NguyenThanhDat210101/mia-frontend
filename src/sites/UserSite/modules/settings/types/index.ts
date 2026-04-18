import type { User, UserInfo } from '../../user/types';

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
  password?: string;
}

export interface StoreUpdateRequest {
  name?: string;
  address?: string;
  prefecture?: string;
  city?: string;
  phone?: string;
  email?: string;
  description?: string;
  avatar?: string;
  timezone?: string;
  opening_hours?: Array<{ day: string; open: string; close: string }>;
}

export interface PaymentGate {
  gateway: string;
  is_enabled: boolean;
  description?: string;
  config: Record<string, unknown>;
}

export interface PaymentSettingsRequest {
  gates: PaymentGate[];
}
