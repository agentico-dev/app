import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Moon, 
  CircuitBoard, 
  Sun, 
  Search, 
  User,
  AtSign,
  PlugZap
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
import { useAuth } from '@/hooks/useAuth';

export function TopNav() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { signOut } = useAuth();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Link to="/" className="flex items-center gap-2 font-semibold md:hidden">
        <img src="/favicon-32x32.png" alt="Agentico" className="h-6 w-6" />
        <CircuitBoard className="h-6 w-6" />
        <span>Agentico {import.meta.env.VITE_REACT_APP_VERSION}</span>
      </Link>

      <div className="w-full flex items-center justify-between gap-2">
        <form className="hidden md:flex-1 md:max-w-sm lg:max-w-md md:flex">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anything..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </form>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant="outline" size="icon">
            <a href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=adrianescutia" target="_blank">
              <PlugZap className="h-4 w-4" />
              <span className="sr-only">Follow me on LinkedIn</span>
            </a>
          </Button>
          <Button variant="outline" size="icon">
            <a href="https://go.rebelion.la/contact-us" target="_blank">
              <AtSign className="h-4 w-4" />
              <span className="sr-only">Contact Us</span>
            </a>
          </Button>
          
          <NotificationsPopover />

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border"
              >
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/teams">Teams</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
