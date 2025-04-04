
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AppWindow,
  Briefcase,
  ChevronRight,
  CircuitBoard,
  Database,
  Folder,
  Home,
  Search,
  Server,
  Settings,
  User,
  Users,
  X,
  Brain,
  Zap,
  Globe,
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
      icon: Folder,
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
      icon: CircuitBoard,
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
          icon: Briefcase,
        },
        {
          title: 'Environments',
          href: '/settings/environments',
          icon: Globe,
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* <div className="flex h-14 items-center border-b border-sidebar-border px-4 sticky top-0 z-10">
        <Link to="/index" className="flex items-center space-x-2">
          <img src="/favicon-32x32.png" alt="Agentico" className="h-6 w-6" />
          <span>Agentico <small style={{ fontSize: '8px' }}>{import.meta.env.VITE_REACT_APP_VERSION}</small></span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div> */}
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
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-4 sticky bottom-0 bg-sidebar">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-sidebar-primary" />
          </div>
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
