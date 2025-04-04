
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AppWindow,
  Briefcase,
  ChevronDown,
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
  Wrench,
  Youtube
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  
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

  const footerNav: NavItem[] = [
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
                collapsed={collapsed}
              />
            ))}
          </div>
          <div className="h-px bg-sidebar-border" />
          {isAuthenticated ? (
            <div className="space-y-1">
              {utilityNav.map((item) => {
                // Special handling for items with submenu
                if (item.submenu && item.submenu.length > 0) {
                  return (
                    <Collapsible 
                      key={item.href}
                      open={isSettingsExpanded}
                      onOpenChange={setIsSettingsExpanded}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                            location.pathname.startsWith(item.href)
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          )}
                        >
                          {!collapsed ? (
                            <>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                              {isSettingsExpanded ? (
                                <ChevronDown className="ml-auto h-4 w-4" />
                              ) : (
                                <ChevronRight className="ml-auto h-4 w-4" />
                              )}
                            </>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center justify-center">
                                    <item.icon className="h-4 w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  {item.title}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-10 space-y-1 mt-1">
                        {item.submenu.map(subItem => (
                          <NavLink
                            key={subItem.href}
                            item={subItem}
                            active={location.pathname === subItem.href}
                            collapsed={collapsed}
                          />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }
                
                // Regular items without submenu
                return (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={location.pathname === item.href}
                    collapsed={collapsed}
                  />
                );
              })}
              <div className="h-px bg-sidebar-border" />
              <div className="space-y-1">
                {footerNav.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={location.pathname === item.href}
                    collapsed={collapsed}
                  />
                ))}
              </div>
              <div className="border-t border-sidebar-border p-4 sticky bottom-0 bg-sidebar">
                {!collapsed ? (
                  <div className="text-sm font-medium">
                    {user.user_metadata.full_name}
                  </div>
                ) : (
                  <div className="text-sm font-medium">
                    {user.user_metadata.full_name[0]}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border-t border-sidebar-border p-4 sticky bottom-0 bg-sidebar">
              {!collapsed ? (
                <div className="text-sm font-medium">Guest</div>
              ) : (
                <div className="text-sm font-medium">G</div>
              )}
              <div className="text-sidebar-foreground/60">
                <Link to="/login">Sign in</Link> for more features
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
  collapsed?: boolean;
};

function NavLink({ item, active, collapsed }: NavLinkProps) {
  if (item.submenu) {
    return null; // We're handling items with submenus separately
  }
  
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
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center justify-center">
                <item.icon className="h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.title}
              {item.badge && <span className="ml-2">{item.badge}</span>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
          {item.badge && (
            <Badge variant="outline" className="ml-auto text-xs bg-purple-100 text-purple-800 border-purple-300">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
}
