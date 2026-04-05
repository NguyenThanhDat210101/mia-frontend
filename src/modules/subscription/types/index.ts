export interface Plan {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  isPopular: boolean;
  buttonColor: string;
  buttonVariant: 'outlined' | 'elevated' | 'flat' | 'text' | 'plain' | 'tonal';
  discount?: string;
}
