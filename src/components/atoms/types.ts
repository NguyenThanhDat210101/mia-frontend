export interface Option {
  label: string;
  value: any;
}

export interface BtnProps {
  color?: string;
  variant?: 'elevated' | 'flat' | 'outlined' | 'tonal' | 'plain' | 'text';
  size?: 'small' | 'default' | 'large' | 'x-large';
  block?: boolean;
  rounded?: boolean | string;
  icon?: string | boolean;
  loading?: boolean;
  disabled?: boolean;
}

export interface CardProps {
  variant?: 'elevated' | 'flat' | 'outlined';
  border?: boolean;
}

export interface ChipProps {
  color?: string;
  variant?: 'elevated' | 'flat' | 'outlined' | 'tonal' | 'plain' | 'text';
  size?: 'small' | 'default' | 'large' | 'x-large';
  elevation?: string | number;
}

export interface IconProps {
  icon: string;
  color?: string;
  size?: 'small' | 'default' | 'large' | 'x-large' | string;
}

export interface InputProps {
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  error?: string;
  class?: string;
}

export interface InputDateProps {
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  class?: string;
}

export interface SelectProps {
  modelValue: any;
  options: Option[];
  placeholder?: string;
  icon?: string;
  leftIcon?: string;
  class?: string;
}

export interface SkeletonProps {
  type?: 'text' | 'avatar' | 'button' | 'card' | 'image' | 'chip';
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  class?: string;
}

export interface SpanProps {
  class?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | 'large';
  weight?: string;
}

export interface OtpInputProps {
  length?: number;
  modelValue?: string;
}

export interface ProgressCircularProps {
  color?: string;
  size?: string | number;
  indeterminate?: boolean;
}

export interface LabelProps {
  class?: string;
}

export interface AvatarProps {
  size?: number | string;
  color?: string;
  icon?: string;
  src?: string;
  alt?: string;
  class?: string;
}

export interface MenuProps {
  minWidth?: string | number;
  rounded?: boolean | string;
  offset?: number | string;
}

export interface SwitchProps {
  modelValue: boolean;
  label?: string;
  color?: string;
  disabled?: boolean;
  hideDetails?: boolean;
}
