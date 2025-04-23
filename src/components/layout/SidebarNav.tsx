
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router';
import { mainNav, utilityNav, footerNav } from './navigation/nav-items';
import { NavLink } from './navigation/NavLink';
import { CollapsibleNavItem } from './navigation/CollapsibleNavItem';

export interface SidebarNavProps {
  onClose?: () => void;
  collapsed?: boolean;
}

export function SidebarNav({ onClose, collapsed }: SidebarNavProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isAgentsExpanded, setIsAgentsExpanded] = useState(false);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <ScrollArea className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-1">
            {mainNav.map((item) => {
              if (item.submenu && item.submenu.length > 0 && item.title === 'Agents') {
                return (
                  <CollapsibleNavItem
                    key={item.href}
                    item={item}
                    isExpanded={isAgentsExpanded}
                    onExpandChange={setIsAgentsExpanded}
                    collapsed={collapsed}
                    currentPath={location.pathname}
                  />
                );
              }

              return (
                <NavLink
                  key={item.href}
                  item={item}
                  active={location.pathname === item.href}
                  collapsed={collapsed}
                />
              );
            })}
          </div>

          <div className="h-px bg-sidebar-border" />

          {isAuthenticated ? (
            <div className="space-y-1">
              {utilityNav.map((item) => {
                if (item.submenu && item.submenu.length > 0) {
                  return (
                    <CollapsibleNavItem
                      key={item.href}
                      item={item}
                      isExpanded={isSettingsExpanded}
                      onExpandChange={setIsSettingsExpanded}
                      collapsed={collapsed}
                      currentPath={location.pathname}
                    />
                  );
                }

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
                <>
                  <div className="text-sm font-medium">Guest</div>
                  <div className="text-sidebar-foreground/60">
                    <Link to="/login">Sign in</Link> for more features
                  </div>
                </>
              ) : (
                <div className="text-sm font-medium">G</div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
