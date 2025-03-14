
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Organization } from '@/types/organization';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Folder, FolderPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface OrganizationProjectsTabProps {
  organization: Organization;
  isAuthenticated: boolean;
  isOrgMember: boolean;
}

export function OrganizationProjectsTab({ 
  organization, 
  isAuthenticated, 
  isOrgMember 
}: OrganizationProjectsTabProps) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['organization-projects', organization.id],
    queryFn: async () => {
      console.log('Fetching projects for organization:', organization.id);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organization.id);
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      console.log('Fetched projects:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Projects in this organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Projects in this organization.</CardDescription>
        </div>
        <Button disabled={!isAuthenticated || !isOrgMember}>
          <FolderPlus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </CardHeader>
      <CardContent>
        {!projects || projects.length === 0 ? (
          <div className="text-center p-6">
            <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              This organization doesn't have any projects yet.
            </p>
            {isAuthenticated && isOrgMember && (
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'archived' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Created {format(new Date(project.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/projects/${project.id}`}>View Project</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
