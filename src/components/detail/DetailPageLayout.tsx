
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode } from 'react';

interface DetailPageLayoutProps {
  isLoading: boolean;
  resource: any | null;
  resourceType: string;
  onGoBack: () => void;
  renderLoading?: () => ReactNode;
  renderNotFound?: () => ReactNode;
  renderResource: () => ReactNode;
}

export function DetailPageLayout({
  isLoading,
  resource,
  resourceType,
  onGoBack,
  renderLoading,
  renderNotFound,
  renderResource
}: DetailPageLayoutProps) {
  const defaultLoadingRenderer = () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-40 w-full" />
    </div>
  );

  const defaultNotFoundRenderer = () => (
    <div className="text-center p-10">
      <h2 className="text-2xl font-bold mb-2">{resourceType} Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The {resourceType.toLowerCase()} you're looking for does not exist or has been removed.
      </p>
      <Button onClick={onGoBack}>Return to {resourceType}s</Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={onGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to {resourceType}s
      </Button>
      
      {isLoading ? (
        renderLoading ? renderLoading() : defaultLoadingRenderer()
      ) : resource ? (
        renderResource()
      ) : (
        renderNotFound ? renderNotFound() : defaultNotFoundRenderer()
      )}
    </div>
  );
}
