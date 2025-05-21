
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface ApiFormStatusProps {
  isLoading: boolean;
  error?: Error | null;
  applicationMissing: boolean;
}

export const ApiFormStatus: React.FC<ApiFormStatusProps> = ({ 
  isLoading, 
  error, 
  applicationMissing 
}) => {
  if (isLoading) {
    return (
      <Alert>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <AlertDescription>
          Loading API data...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading API data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (applicationMissing) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Application not found.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
