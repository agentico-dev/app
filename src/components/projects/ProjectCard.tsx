
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router';
import { CircuitBoard, AppWindow, Server, Star } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  toolsCount?: number;
  applicationsCount?: number;
  serversCount?: number;
  status: string;
  favorite: boolean;
  tags: string[];
  tools_count?: number;
  applications_count?: number;
  servers_count?: number;
  slug: string;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            {project.favorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-2" />
            )}
          </div>
          <CardDescription className="mt-1">
            {project.description || 'No description available'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags && project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <CircuitBoard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.tools_count || project.toolsCount || 0} tools</span>
          </div>
          <div className="flex items-center">
            <AppWindow className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.applications_count || project.applicationsCount || 0} apps</span>
          </div>
          <div className="flex items-center">
            <Server className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{project.servers_count || project.serversCount || 0} servers</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`
          ${project.status === 'Active' ? 'tag-green' : ''}
          ${project.status === 'Development' ? 'tag-purple' : ''}
          ${project.status === 'Maintenance' ? 'tag-yellow' : ''}
          ${project.status === 'Archived' ? 'tag-red' : ''}
        `}>
          {project.status}
        </Badge>
        <Button asChild>
          <Link to={`/projects/${project.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProjectCard;
