import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Building, Users, Calendar } from 'lucide-react';
import { Organization } from '@/types/organization';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface OrganizationsListProps {
  organizations: Organization[];
  isLoading: boolean;
}

export default function OrganizationsList({ organizations, isLoading }: OrganizationsListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="p-4 flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-9 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center">
        <Building className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No organizations found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          {organizations.length === 0
            ? "There are no organizations available yet. Create your first organization to get started."
            : "You're not a member of any organizations yet."}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <Card key={org.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{org.name}</CardTitle>
              {org.role && (
                <Badge variant="outline" className="ml-2">
                  {org.role}
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {org.description || 'No description available'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="mr-2 h-4 w-4" />
              Created {format(new Date(org.created_at), 'MMM d, yyyy')}
            </div>
          </CardContent>
          <CardFooter className="p-4 flex justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">Members</span>
            </div>
            <Button asChild>
              <Link to={`/organizations/${org.slug}`}>View</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
