
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApplicationAPI } from '@/types/application';
import { CodeEditor } from '@/components/editor/CodeEditor';

interface ApiDetailsViewProps {
  api: ApplicationAPI;
}

export default function ApiDetailsView({ api }: ApiDetailsViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>API Overview</CardTitle>
            <Badge variant={api.status === 'active' ? 'default' : 'outline'}>
              {api.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Name</h3>
            <p className="text-sm text-muted-foreground">{api.name}</p>
          </div>
          
          {api.description && (
            <div>
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{api.description}</p>
            </div>
          )}
          
          {api.version && (
            <div>
              <h3 className="text-sm font-medium">Version</h3>
              <p className="text-sm text-muted-foreground">{api.version}</p>
            </div>
          )}
          
          {api.protocol && (
            <div>
              <h3 className="text-sm font-medium">Protocol</h3>
              <p className="text-sm text-muted-foreground">{api.protocol}</p>
            </div>
          )}

          {api.tags && api.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium">Tags</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {api.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {api.source_uri && (
        <Card>
          <CardHeader>
            <CardTitle>Source URI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground break-all font-mono">
              {api.source_uri}
            </p>
          </CardContent>
        </Card>
      )}

      {api.source_content && (
        <Card>
          <CardHeader>
            <CardTitle>API Specification</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor 
              value={api.source_content || ''}
              language={api.content_format || 'json'}
              className="min-h-[300px] max-h-[600px]"
              readOnly={true}
              onChange={() => {}} // Add empty onChange handler to satisfy the interface
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
