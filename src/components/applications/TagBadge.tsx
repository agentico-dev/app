
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag as TagIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  name: string;
  category?: string;
  tagId?: string;
  onRemove?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  className?: string;
}

export function TagBadge({
  name,
  category,
  tagId,
  onRemove,
  variant = 'secondary',
  className,
}: TagBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        'text-xs flex items-center gap-1 group px-2 py-1',
        onRemove && 'pr-1',
        className
      )}
    >
      <TagIcon className="h-3 w-3" />
      <span>{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-background/20 rounded-full"
          aria-label={`Remove ${name} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}

export default TagBadge;
