
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AIToolsSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function AIToolsSearch({ searchTerm, setSearchTerm }: AIToolsSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search tools by name or description..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
