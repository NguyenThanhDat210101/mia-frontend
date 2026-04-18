import type { User, UserInfo } from '../../user/types';

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
}

export interface StoreUpdateRequest {
  name?: string;
  address?: string;
  description?: string;
  logo_url?: string;
}

export interface PaymentGate {
  id: string;
  name: string;
  is_enabled: boolean;
  description?: string;
  config: Record<string, string>;
}

export interface PaymentSettingsRequest {
  gates: PaymentGate[];
}
