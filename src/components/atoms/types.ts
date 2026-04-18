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
  class?: any;
}

export interface CardProps {
  variant?: 'elevated' | 'flat' | 'outlined';
  border?: boolean;
  class?: any;
  padding?: string;
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
  size?: 'small' | 'default' | 'large' | 'x-large' | string | number;
  class?: any;
}

export interface InputProps {
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  error?: string;
  class?: any;
}

export interface InputDateProps {
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  class?: any;
}

export interface SelectProps {
  modelValue: any;
  options: Option[];
  placeholder?: string;
  icon?: string;
  leftIcon?: string;
  class?: any;
}

export interface SkeletonProps {
  type?: 'text' | 'avatar' | 'button' | 'card' | 'image' | 'chip';
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none';
  class?: any;
}

export interface SpanProps {
  class?: any;
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
  class?: any;
}

export interface AvatarProps {
  size?: number | string;
  color?: string;
  icon?: string;
  src?: string;
  alt?: string;
  class?: any;
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

export interface AppProps {
  theme?: string;
}

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  variant?: 'elevated' | 'flat' | 'outlined' | 'tonal' | 'plain';
  density?: 'default' | 'comfortable' | 'compact';
  closable?: boolean;
  class?: any;
}

export interface DialogProps {
  modelValue: boolean;
  maxWidth?: string | number;
  persistent?: boolean;
}

export interface ImgProps {
  src?: string;
  alt?: string;
  cover?: boolean;
  height?: string | number;
  width?: string | number;
  class?: any;
}

export interface WindowProps {
  modelValue?: any;
  class?: any;
}

export interface WindowItemProps {
  value?: any;
}
