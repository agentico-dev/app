
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "flex-shrink-0 transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border h-[calc(100vh-4rem)] sticky top-16",
            sidebarOpen ? (isMobile ? 'w-full fixed inset-0 z-40' : 'w-64') : 'w-0'
          )}
        >
          {sidebarOpen && <SidebarNav onClose={isMobile ? toggleSidebar : undefined} />}
        </div>
        
        <div className="flex-1 overflow-auto">
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
            )}
            
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
