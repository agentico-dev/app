
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

export function AIToolsEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        No tools found.
      </TableCell>
    </TableRow>
  );
}
