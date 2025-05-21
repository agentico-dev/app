
import React from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { NavItem } from './types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

type NavLinkProps = {
  item: NavItem;
  active?: boolean;
  collapsed?: boolean;
};

export function NavLink({ item, active, collapsed }: NavLinkProps) {
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
