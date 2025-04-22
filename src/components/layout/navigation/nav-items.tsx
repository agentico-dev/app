
import {
  AppWindow,
  Briefcase,
  Database,
  Home,
  Hotel,
  Search,
  Server,
  Settings,
  User,
  Brain,
  Zap,
  Globe,
  AtSign,
  ConciergeBellIcon,
  Wrench,
  Youtube,
  Bot,
  ListTodo,
  PlaySquare
} from 'lucide-react';
import { NavItem } from './types';

export const mainNav: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: Briefcase,
  },
  {
    title: 'Applications',
    href: '/apps',
    icon: AppWindow,
  },
  {
    title: 'Servers',
    href: '/servers',
    icon: Server,
  },
  {
    title: 'AI Tools',
    href: '/tools',
    icon: Wrench,
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Bot,
    submenu: [
      {
        title: 'Manage Agents',
        href: '/agents',
        icon: Bot,
      },
      {
        title: 'Tasks',
        href: '/agents/tasks',
        icon: ListTodo,
      },
      {
        title: 'Playground',
        href: '/agents/playground',
        icon: PlaySquare,
        badge: 'New',
      },
    ],
  },
];

export const utilityNav: NavItem[] = [
  {
    title: 'Search',
    href: '/search',
    icon: Search,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    submenu: [
      {
        title: 'Profile',
        href: '/profile',
        icon: User,
      },        
      {
        title: 'Organizations',
        href: '/orgs',
        icon: Hotel,
      },
      {
        title: 'Environments',
        href: '/settings/environments',
        icon: Globe,
      },
    ],
  },
];

export const footerNav: NavItem[] = [
  {
    title: 'Documentation',
    href: 'https://agentico.dev/docs/intro',
    icon: Brain,
  },
  {
    title: 'Contact Us',
    href: 'https://go.rebelion.la/contact-us',
    icon: AtSign,
  },
  {
    title: 'Discord',
    href: 'https://discord.gg/jPvHkE9eKf',
    icon: ConciergeBellIcon,
  },
  {
    title: 'YouTube',
    href: 'https://www.youtube.com/playlist?list=PL7wYqDMFQYFO2COpAblqESwBmxX0Lbv-c',
    icon: Youtube,
  },
];
