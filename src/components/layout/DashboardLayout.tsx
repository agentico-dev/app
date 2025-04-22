
import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { SidebarNav } from './SidebarNav';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen flex flex-col subtle-mesh">
      <TopNav
        sidebarCollapsed={sidebarCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={isMobile ? { x: "-100%" } : { width: 0 }}
              animate={
                isMobile 
                  ? { x: 0 } 
                  : { 
                      width: sidebarHovered || !sidebarCollapsed ? 256 : 64 
                    }
              }
              exit={isMobile ? { x: "-100%" } : { width: 0 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut" 
              }}
              className={cn(
                "transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border h-screen fixed top-16",
                isMobile ? 'w-full inset-0 z-40' : 'z-30', // Ensure proper z-index
                "overflow-hidden" // Prevent overflow issues
              )}
              onMouseEnter={() => setSidebarHovered(true)}
              onMouseLeave={() => setSidebarHovered(false)}
            >
              <div className="flex flex-col h-full">
                <SidebarNav
                  onClose={isMobile ? toggleSidebar : undefined}
                  collapsed={!sidebarHovered && sidebarCollapsed}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          className={cn(
            "flex-1 overflow-auto transition-all duration-300",
            "relative z-10" // Ensure main content is above the sidebar
          )}
          style={{
            marginLeft: sidebarOpen && !isMobile 
              ? sidebarCollapsed && !sidebarHovered ? 64 : 256
              : 0
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="container py-6 px-4 md:px-6 min-h-screen">
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
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
