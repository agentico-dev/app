
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
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SidebarNavProps = {
  onClose?: () => void;
};

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: NavItem[];
  expanded?: boolean;
};

export function SidebarNav({ onClose }: SidebarNavProps) {
  const location = useLocation();
  
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
      href: '/applications',
      icon: AppWindow,
    },
    {
      title: 'Servers',
      href: '/servers',
      icon: Server,
    },
    {
      title: 'AI Tools',
      href: '/ai-tools',
      icon: CircuitBoard,
    },
    {
      title: 'Models',
      href: '/models',
      icon: Brain,
    },
    {
      title: 'Data',
      href: '/data',
      icon: Database,
    },
    {
      title: 'Agents',
      href: '/agents',
      icon: Users,
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
    },
  ];

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link to="/" className="flex items-center space-x-2">
          <CircuitBoard className="h-6 w-6 text-sidebar-primary" />
          <span className="font-semibold">AI Tools Hub</span>
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
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
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
          <div className="space-y-1">
            {utilityNav.map((item) => (
              <NavLink 
                key={item.href} 
                item={item} 
                active={location.pathname === item.href} 
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="text-sm">
            <div className="font-medium">User Name</div>
            <div className="text-sidebar-foreground/60">user@example.com</div>
          </div>
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
      {item.submenu && (
        <ChevronRight className="ml-auto h-4 w-4" />
      )}
    </Link>
  );
}
