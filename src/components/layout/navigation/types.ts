
import { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  submenu?: NavItem[];
  expanded?: boolean;
  badge?: string;
};
