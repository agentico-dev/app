
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApplicationApis } from '@/hooks/useApplicationApis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
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
import { ApplicationAPI } from '@/types/application';

interface APIsListProps {
  applicationId: string;
}

export default function APIsList({ applicationId }: APIsListProps) {
  const navigate = useNavigate();
  const { apis, isLoading, error, deleteApi } = useApplicationApis(applicationId);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiToDelete, setApiToDelete] = useState<ApplicationAPI | null>(null);

  const filteredApis = apis?.filter(api => 
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (api.description && api.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteConfirm = () => {
    if (apiToDelete) {
      deleteApi.mutate(apiToDelete.id);
      setApiToDelete(null);
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
      case 'deprecated':
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
        <h3 className="text-lg font-medium">Error loading APIs</h3>
        <p className="text-muted-foreground">
          There was a problem loading the API list. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search APIs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredApis && filteredApis.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApis.map((api) => (
            <Card key={api.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{api.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <span className={`rounded-full h-2 w-2 ${getStatusColor(api.status)}`} />
                    <span className="text-xs capitalize">{api.status}</span>
                  </div>
                </div>
                {api.version && (
                  <Badge variant="outline" className="mt-1">v{api.version}</Badge>
                )}
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {api.description || "No description provided"}
                </p>
                {api.endpoint_url && (
                  <div className="mt-3 flex items-center text-sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <a 
                      href={api.endpoint_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate"
                    >
                      {api.endpoint_url}
                    </a>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-1">
                  {api.tags && api.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Created: {formatDate(api.created_at)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/applications/${applicationId}/apis/${api.id}`)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setApiToDelete(api)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium">No APIs found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "No APIs match your search criteria." : "This application doesn't have any APIs yet."}
          </p>
          <Button onClick={() => navigate(`/applications/${applicationId}/apis/new`)}>
            Create your first API
          </Button>
        </div>
      )}

      <AlertDialog open={!!apiToDelete} onOpenChange={(open) => !open && setApiToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this API?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the API
              "{apiToDelete?.name}" and all its associated data.
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
