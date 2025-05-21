
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Server } from 'lucide-react';
import { useNavigate } from 'react-router';

interface EmptyServerStateProps {
  hasServers: boolean;
  isFiltered: boolean;
  searchQuery?: string;
}

export function EmptyServerState({ hasServers, isFiltered, searchQuery }: EmptyServerStateProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl">No Servers Found</CardTitle>
        <CardDescription>
          {hasServers && isFiltered
            ? "No servers match your current filters. Try changing your search criteria."
            : "You haven't created any servers yet. Click 'New Server' to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-8">
        <Server className="h-16 w-16 text-muted-foreground mb-4" />
        <Button onClick={() => navigate('/servers/new')} className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Server
        </Button>
      </CardContent>
    </Card>
  );
}

export default EmptyServerState;
