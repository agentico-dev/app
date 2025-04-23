
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { EnhancedAITool } from '@/types/ai-tool';

interface AIToolTableRowProps {
  tool: EnhancedAITool;
  onToggleAssociation: (id: string, associated: boolean) => void;
  isUpdating: boolean;
}

export function AIToolTableRow({ 
  tool, 
  onToggleAssociation,
  isUpdating
}: AIToolTableRowProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Switch
          checked={tool.associated}
          onCheckedChange={(checked) => onToggleAssociation(tool.id, checked)}
          disabled={isUpdating}
        />
      </TableCell>
      <TableCell className="font-medium">{tool.name}</TableCell>
      <TableCell>{tool.description || 'No description'}</TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={`${getStatusColor(tool.status)}`}
        >
          {tool.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {tool.application_service && (
            <div className="text-sm">
              <span className="font-medium">Service:</span>{' '}
              {tool.application_service.name}
            </div>
          )}
          {tool.application_api && (
            <div className="text-sm">
              <span className="font-medium">API:</span>{' '}
              <Link 
                to={`/applications/${tool.application?.id}/apis/${tool.application_api.id}`}
                className="text-primary hover:underline"
              >
                {tool.application_api.name} {tool.application_api.version}
              </Link>
            </div>
          )}
          {tool.application && (
            <div className="text-sm">
              <span className="font-medium">Application:</span>{' '}
              <Link 
                to={`/applications/${tool.application.slug}`}
                className="text-primary hover:underline"
              >
                {tool.application.name}
              </Link>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
