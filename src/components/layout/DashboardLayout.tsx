import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { SidebarNav } from './SidebarNav';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // State for collapsed sidebar
  const [sidebarHovered, setSidebarHovered] = useState(false); // State for hover effect
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav
        sidebarCollapsed={sidebarCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border h-screen fixed top-16",
            sidebarOpen
              ? isMobile
                ? 'w-full inset-0 z-40'
                : sidebarHovered || !sidebarCollapsed
                ? 'w-64' // Expanded width on hover or when not collapsed
                : 'w-16' // Collapsed width
              : 'w-0'
          )}
          onMouseEnter={() => setSidebarHovered(true)} // Expand on hover
          onMouseLeave={() => setSidebarHovered(false)} // Collapse when hover ends
        >
          {sidebarOpen && (
            <div className="flex flex-col h-full">
              <SidebarNav
                onClose={isMobile ? toggleSidebar : undefined}
                collapsed={!sidebarHovered && sidebarCollapsed} // Pass hover state
              />
            </div>
          )}
        </div>
        
        <div
          className={cn(
            "flex-1 overflow-auto transition-all duration-300",
            sidebarOpen && !isMobile
              ? sidebarCollapsed && !sidebarHovered
                ? 'ml-16' // Adjust for collapsed sidebar
                : 'ml-64' // Adjust for expanded sidebar
              : 'ml-0'
          )}
        >
          <div className="container py-6 px-4 md:px-6">
            {isMobile && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleSidebar} 
                className="mb-4 md:hidden"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            )
            }
            
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
