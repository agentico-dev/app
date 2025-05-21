
import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Moon, 
  CircuitBoard, 
  Sun, 
  Search, 
  User,
  AtSign,
  PlugZap,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';
import { useAuth } from '@/hooks/auth';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

export function TopNav({ sidebarCollapsed, toggleCollapse }: { sidebarCollapsed: boolean; toggleCollapse: () => void }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { signOut, session } = useAuth();
  const isAuthenticated = !!session.user;
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    // Store in localStorage to maintain selection across page loads
    localStorage.setItem('selectedOrganizationId', orgId);
    // You could add additional logic here like refreshing data based on selected org
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-sm bg-background/80 border-b border-border/40 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hidden md:flex hover:bg-background/80"
          >
            {sidebarCollapsed ? 
              <ChevronRight className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
            <span className="sr-only">{sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
          </Button>
          <Link to="/index" className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-green-500/70 flex items-center justify-center shadow-lg">
              <img src="/favicon-32x32.png" alt="Agentico" className="h-6 w-6" />
            </div>
            {!sidebarCollapsed && (
              <motion.span 
                className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent hidden sm:inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Agentico <small style={{ fontSize: '7px' }}>{import.meta.env.VITE_REACT_APP_VERSION}</small>
              </motion.span>
            )}
          </Link>
        </motion.div>

        <div className="w-full flex items-center justify-between gap-2">
          <motion.form 
            className="hidden md:flex-1 md:max-w-sm lg:max-w-md md:flex relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-full bg-background/50 pl-8 md:w-[300px] lg:w-[400px] border-input/50 focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </motion.form>

          <motion.div 
            className="flex flex-1 items-center justify-end gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.05 }}
          >
            {isAuthenticated && (
              <motion.div 
                className="w-[200px] mr-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <OrganizationSelector
                  selectedOrgId={selectedOrgId}
                  onOrganizationChange={handleOrganizationChange}
                  includeGlobal={true}
                />
              </motion.div>
            )}
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-200">
                <a href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=adrianescutia" target="_blank">
                  <PlugZap className="h-4 w-4" />
                  <span className="sr-only">Follow me on LinkedIn</span>
                </a>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-200">
                <a href="https://go.rebelion.la/contact-us" target="_blank">
                  <AtSign className="h-4 w-4" />
                  <span className="sr-only">Contact Us</span>
                </a>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <NotificationsPopover />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-primary/10 transition-all duration-200">
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-border/50 hover:bg-primary/10 transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 bg-popover/80 backdrop-blur-md border-border/50">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
                        <Link to="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
                        <Link to="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
                        <Link to="/orgs">Organizations</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="hover:bg-destructive/10 text-destructive transition-colors duration-200 cursor-pointer">
                        Log out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
                        <Link to="/login">Sign In</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
                        <Link to="/register">Register</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
