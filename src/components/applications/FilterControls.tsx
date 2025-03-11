
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Application } from '@/types/application';

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  applications: Application[];
}

export function FilterControls({ 
  searchQuery, 
  setSearchQuery, 
  activeFilter, 
  setActiveFilter, 
  applications 
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search applications..."
          className="pl-8 w-full md:max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setActiveFilter(null)}>
            All Applications
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveFilter('favorite')}>
            Favorites
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveFilter('active')}>
            Active
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          {[...new Set(applications.map(app => app.category))].map(category => (
            <DropdownMenuItem key={category} onClick={() => setActiveFilter(category)}>
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FilterControls;
