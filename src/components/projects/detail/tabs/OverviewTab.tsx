
interface OverviewTabProps {
  description: string | null;
}

export function OverviewTab({ description }: OverviewTabProps) {
  return (
    <p className="text-muted-foreground">
      {description || 'No detailed description available for this project.'}
    </p>
  );
}
