
import { Button } from '@/components/ui/button';

interface ResourceNotFoundProps {
  resourceType: string;
  onGoBack: () => void;
}

export function ResourceNotFound({ resourceType, onGoBack }: ResourceNotFoundProps) {
  return (
    <div className="text-center p-10">
      <h2 className="text-2xl font-bold mb-2">{resourceType} Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The {resourceType.toLowerCase()} you're looking for does not exist or has been removed.
      </p>
      <Button onClick={onGoBack}>Return to {resourceType}s</Button>
    </div>
  );
}
