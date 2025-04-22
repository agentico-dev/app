
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Folder, Star } from 'lucide-react';
import { Link } from 'react-router';

interface EmptyProjectStateProps {
  type: 'all' | 'favorites' | 'search';
  searchQuery?: string;
  isAuthenticated: boolean;
}

export function EmptyProjectState({ type, searchQuery, isAuthenticated }: EmptyProjectStateProps) {
  let title = 'No projects found';
  let icon = <Folder className="h-12 w-12 text-muted-foreground mb-4" />;
  let description = 'There are no projects available yet. Create your first project to get started.';

  if (type === 'favorites') {
    title = 'No favorite projects';
    icon = <Star className="h-12 w-12 text-muted-foreground mb-4" />;
    description = "You haven't marked any projects as favorites yet.";
  } else if (type === 'search' && searchQuery) {
    description = "No projects match your search criteria. Try adjusting your filters.";
  }

  return (
    <Card className="p-8 flex flex-col items-center justify-center">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        {description}
      </p>
      {isAuthenticated && type !== 'search' && (
        <Button asChild>
          <Link to="/projects/new">Create Project</Link>
        </Button>
      )}
    </Card>
  );
}

export default EmptyProjectState;
