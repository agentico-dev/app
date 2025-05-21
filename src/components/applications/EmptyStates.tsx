
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

interface EmptyStateProps {
  type: 'loading' | 'error' | 'no-applications' | 'no-favorites';
}

export function EmptyState({ type }: EmptyStateProps) {
  const { session } = useAuth();
  const isAuthenticated = !!session.user;
  switch (type) {
    case 'loading':
      return (
        <div className="flex justify-center p-8">
          <p>Loading applications...</p>
        </div>
      );
    case 'error':
      return (
        <div className="flex justify-center p-8">
          <p className="text-red-500">Failed to load applications</p>
        </div>
      );
    case 'no-applications':
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-4 text-muted-foreground">No applications found</p>
          <Button asChild>
            <Link to={isAuthenticated ? "/applications/new" : "/login"}>Create your first application</Link>
          </Button>
        </div>
      );
    case 'no-favorites':
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-4 text-muted-foreground">No favorite applications found</p>
          <p className="text-sm text-muted-foreground">Mark applications as favorites to see them here</p>
        </div>
      );
    default:
      return null;
  }
}

export default EmptyState;
