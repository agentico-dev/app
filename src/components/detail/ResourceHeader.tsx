
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

interface ResourceHeaderProps {
  title: string;
  description: string | null;
  isFavorite?: boolean;
  status?: string;
  tags?: string[] | React.ReactNode[];
  statusColorClass?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ResourceHeader({
  title,
  description,
  isFavorite = false,
  status,
  tags = [],
  statusColorClass = '',
  onEdit,
  onDelete
}: ResourceHeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
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
        {onEdit && <Button variant="outline" onClick={onEdit}>Edit</Button>}
        {onDelete && <Button variant="destructive" onClick={onDelete}>Delete</Button>}
      </div>
    </div>
  );
}
