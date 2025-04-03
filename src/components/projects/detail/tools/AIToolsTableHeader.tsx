
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { EnhancedAITool } from '@/types/ai-tool';

interface AIToolsTableHeaderProps {
  sortField: keyof EnhancedAITool | 'associated';
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof EnhancedAITool | 'associated') => void;
}

export function AIToolsTableHeader({ 
  sortField, 
  sortDirection, 
  handleSort 
}: AIToolsTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[80px]">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleSort('associated')}
          >
            Associated
            {sortField === 'associated' && (
              sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
            )}
          </div>
        </TableHead>
        <TableHead>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleSort('name')}
          >
            Name
            {sortField === 'name' && (
              sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
            )}
          </div>
        </TableHead>
        <TableHead>Description</TableHead>
        <TableHead>
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleSort('status')}
          >
            Status
            {sortField === 'status' && (
              sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
            )}
          </div>
        </TableHead>
        <TableHead>Related Services</TableHead>
      </TableRow>
    </TableHeader>
  );
}
