
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
import { motion } from 'framer-motion';

export interface SidebarNavProps {
  onClose?: () => void;
  collapsed?: boolean;
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <ScrollArea className="flex-1 px-3 py-4 overflow-y-auto fixed w-64 h-[calc(100vh-6rem)]">
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div className="space-y-1" variants={containerVariants}>
            {mainNav.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <NavLink
                  item={item}
                  active={location.pathname === item.href}
                  collapsed={collapsed}
                />
              </motion.div>
            ))}
          </motion.div>
          <div className="h-px bg-sidebar-border" />
          {isAuthenticated && (
            <motion.div className="space-y-1" variants={containerVariants}>
              {utilityNav.map((item) => (
                <motion.div key={item.href} variants={itemVariants}>
                  <NavLink
                    item={item}
                    active={location.pathname === item.href}
                    collapsed={collapsed}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-4 sticky bottom-0 bg-sidebar">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
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
          {!isAuthenticated && !collapsed && (
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
  collapsed?: boolean;
};

function NavLink({ item, active, collapsed }: NavLinkProps) {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 relative overflow-hidden",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary"
          : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <div className={cn(
        "transition-all duration-200",
        active ? "text-primary" : "text-sidebar-foreground/70"
      )}>
        <item.icon className="h-4 w-4" />
      </div>
      
      {!collapsed && (
        <>
          <span className={cn(
            "transition-all duration-200",
            active ? "font-medium" : ""
          )}>{item.title}</span>
          
          {item.badge && (
            <Badge variant="outline" className="ml-auto text-xs bg-purple-100 text-purple-800 border-purple-300">
              {item.badge}
            </Badge>
          )}
          
          {item.submenu && (
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
        </>
      )}
    </Link>
  );
}
