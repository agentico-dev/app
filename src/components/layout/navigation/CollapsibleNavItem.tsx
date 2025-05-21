
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from './types';
import { NavLink } from './NavLink';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

type CollapsibleNavItemProps = {
  item: NavItem;
  isExpanded: boolean;
  onExpandChange: (isExpanded: boolean) => void;
  collapsed?: boolean;
  currentPath: string;
};

export function CollapsibleNavItem({ 
  item, 
  isExpanded, 
  onExpandChange,
  collapsed,
  currentPath
}: CollapsibleNavItemProps) {
  return (
    <Collapsible 
      open={isExpanded}
      onOpenChange={onExpandChange}
    >
      <CollapsibleTrigger className="w-full">
        <div
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
            currentPath.startsWith(item.href)
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}
        >
          {!collapsed ? (
            <>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              {item.badge && (
                <Badge variant="outline" className="ml-auto text-xs bg-purple-100 text-purple-800 border-purple-300">
                  {item.badge}
                </Badge>
              )}
              {isExpanded ? (
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
                  {item.badge && <span className="ml-2">{item.badge}</span>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-10 space-y-1 mt-1">
        {item.submenu?.map(subItem => (
          <NavLink
            key={subItem.href}
            item={subItem}
            active={currentPath === subItem.href}
            collapsed={collapsed}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
