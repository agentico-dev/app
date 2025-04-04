
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AppWindow,
  Briefcase,
  ChevronRight,
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
  Wrench
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

export interface SidebarNavProps {
  onClose?: () => void;
  collapsed?: boolean; // Add collapsed property
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: NavItem[];
  expanded?: boolean;
  badge?: string;
};

export function SidebarNav({ onClose, collapsed }: SidebarNavProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const mainNav: NavItem[] = [
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
      title: 'Studio',
      href: '/studio',
      icon: Zap,
      badge: 'Pro',
    },
  ];

  const utilityNav: NavItem[] = [
    {
      title: 'Search',
      href: '/search',
      icon: Search,
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: User,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      submenu: [
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

  const footerNav: NavItem[] = [
    {
      title: 'Documentation',
      href: 'https://agentico.dev/docs',
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
      title: 'Help',
      href: '/help',
      icon: Database,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <ScrollArea className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={location.pathname === item.href}
              />
            ))}
          </div>
          <div className="h-px bg-sidebar-border" />
          {isAuthenticated && (
            <div className="space-y-1">
              {utilityNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={location.pathname === item.href}
                />
              ))}
              <div className="border-t border-sidebar-border p-4 sticky bottom-0 bg-sidebar">
                {!collapsed ? (
                  <div className="text-sm font-medium">
                    {isAuthenticated ? user.user_metadata.full_name : 'Guest'}
                  </div>
                ) : (
                  <div className="text-sm font-medium">
                    {isAuthenticated ? user.user_metadata.full_name[0] : 'G'}
                  </div>
                )}
                {!isAuthenticated && (
                  <div className="text-sidebar-foreground/60">
                    <Link to="/login">Sign in</Link> for more features
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

type NavLinkProps = {
  item: NavItem;
  active?: boolean;
};

function NavLink({ item, active }: NavLinkProps) {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.title}</span>
      {item.badge && (
        <Badge variant="outline" className="ml-auto text-xs bg-purple-100 text-purple-800 border-purple-300">
          {item.badge}
        </Badge>
      )}
      {item.submenu && (
        <ChevronRight className="ml-auto h-4 w-4" />
      )}
    </Link>
  );
}
