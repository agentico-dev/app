
export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  active: boolean;
}
