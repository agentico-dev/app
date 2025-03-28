
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApplicationServices } from '@/hooks/useApplicationServices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Server } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { ApplicationService } from '@/types/application';

interface ServicesListProps {
  applicationId: string;
  apiId?: string;
}

export default function ServicesList({ applicationId, apiId }: ServicesListProps) {
  const navigate = useNavigate();
  // Pass both params to get the right services
  const { services, isLoading, error, deleteService } = useApplicationServices(applicationId, apiId);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceToDelete, setServiceToDelete] = useState<ApplicationService | null>(null);

  const filteredServices = services?.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      deleteService.mutate(serviceToDelete.id);
      setServiceToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'maintenance':
        return 'bg-amber-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Error loading services</h3>
        <p className="text-muted-foreground">
          There was a problem loading the service list. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredServices && filteredServices.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{service.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <span className={`rounded-full h-2 w-2 ${getStatusColor(service.status)}`} />
                    <span className="text-xs capitalize">{service.status}</span>
                  </div>
                </div>
                {service.service_type && (
                  <Badge variant="outline" className="mt-1">{service.service_type}</Badge>
                )}
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {service.description || "No description provided"}
                </p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {service.tags && service.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Created: {formatDate(service.created_at)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/applications/${applicationId}/services/${service.id}${apiId ? `?api_id=${apiId}` : ''}`)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setServiceToDelete(service)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium">No services found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "No services match your search criteria." : "This application doesn't have any services yet."}
          </p>
          <Button onClick={() => navigate(`/applications/${applicationId}/services/new${apiId ? `?api_id=${apiId}` : ''}`)}>
            Create your first service
          </Button>
        </div>
      )}

      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service
              "{serviceToDelete?.name}" and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
