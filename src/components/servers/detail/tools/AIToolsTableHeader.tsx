
import { ArrowUp, ArrowDown } from 'lucide-react';
import { 
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { EnhancedAITool } from '@/types/ai-tool';

interface AIToolsTableHeaderProps {
  sortField: keyof EnhancedAITool | 'associated';
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof EnhancedAITool | 'associated') => void;
}

export function AIToolsTableHeader({ 
  sortField, 
  sortDirection, 
  onSort 
}: AIToolsTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[80px]">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onSort('associated')}
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
            onClick={() => onSort('name')}
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
            onClick={() => onSort('status')}
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
