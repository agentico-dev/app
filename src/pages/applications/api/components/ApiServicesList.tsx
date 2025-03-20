
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApplicationServices } from '@/hooks/useApplicationServices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

interface ApiServicesListProps {
  apiId?: string;
  applicationId: string;
}

export default function ApiServicesList({ apiId, applicationId }: ApiServicesListProps) {
  const navigate = useNavigate();
  // Pass both applicationId and apiId to the hook
  const { services, isLoading, error, deleteService } = useApplicationServices(applicationId, apiId);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceToDelete, setServiceToDelete] = useState<ApplicationService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter services based on search term
  const filteredServices = services?.filter(service => 
    searchTerm === '' || 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteConfirm = async () => {
    if (serviceToDelete) {
      setIsDeleting(true);
      try {
        await deleteService.mutateAsync(serviceToDelete.id);
      } finally {
        setIsDeleting(false);
        setServiceToDelete(null);
      }
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
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex flex-wrap gap-1 mt-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-36 mt-4" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 border rounded-lg bg-muted/10">
        <h3 className="text-lg font-medium">Error loading services</h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading the service list. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
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
        <Button onClick={() => navigate(`/applications/${applicationId}/services/new?api_id=${apiId}`)}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Service
        </Button>
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
                  onClick={() => navigate(`/applications/${applicationId}/services/${service.id}?api_id=${apiId}`)}
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
            {searchTerm ? "No services match your search criteria." : "This API doesn't have any services yet."}
          </p>
          <Button onClick={() => navigate(`/applications/${applicationId}/services/new?api_id=${apiId}`)}>
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
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
              className="relative"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
