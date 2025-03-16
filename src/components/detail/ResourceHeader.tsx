
import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ResourceHeaderProps {
  title: string;
  description: string | null;
  isFavorite?: boolean;
  status?: string;
  tags?: string[] | React.ReactNode[];
  statusColorClass?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  resourceId?: string;
  resourceType?: 'Project' | 'Server';
  resourceSlug?: string;
}

export function ResourceHeader({
  title,
  description,
  isFavorite = false,
  status,
  tags = [],
  statusColorClass = '',
  onEdit,
  onDelete,
  resourceId,
  resourceType,
  resourceSlug
}: ResourceHeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else if (resourceType && (resourceSlug || resourceId)) {
      // Redirect to the appropriate edit page based on resourceType
      // Prefer slug over ID when available
      const resourceIdentifier = resourceSlug || resourceId;
      switch (resourceType) {
        case 'Project':
          navigate(`/projects/${resourceIdentifier}/edit`);
          break;
        case 'Server':
          navigate(`/servers/${resourceIdentifier}/edit`);
          break;
      }
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete();
    } else if (resourceType && resourceId) {
      try {
        // Different logic based on resourceType
        switch (resourceType) {
          case 'Project':
            // Navigate back to projects list after deletion
            toast.success('Project deleted successfully');
            navigate('/projects');
            break;
          case 'Server':
            // Navigate back to servers list after deletion
            toast.success('Server deleted successfully');
            navigate('/servers');
            break;
        }
      } catch (error) {
        console.error(`Error deleting ${resourceType}:`, error);
        toast.error(`Failed to delete ${resourceType}`);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {isFavorite && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
        </div>
        <p className="text-muted-foreground mt-1">{description || 'No description provided'}</p>
        
        {(status || tags.length > 0) && (
          <div className="flex flex-wrap gap-2 my-3">
            {status && (
              <Badge className={statusColorClass}>
                {status}
              </Badge>
            )}
            {tags.map((tag, index) => (
              typeof tag === 'string' ? (
                <Badge key={index} variant="outline">{tag}</Badge>
              ) : (
                <React.Fragment key={index}>{tag}</React.Fragment>
              )
            ))}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleEdit}
        >
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the {resourceType?.toLowerCase() || 'resource'} 
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
