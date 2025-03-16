
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { AppWindow, CircuitBoard, Star, Tag, X } from 'lucide-react';
import { Application } from '@/types/application';
import { useTags } from '@/contexts/TagsContext';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { removeTagFromResource } = useTags();

  // Fetch organization slug if needed
  const { data: organization } = useQuery({
    queryKey: ['organization', application.organization_id],
    queryFn: async () => {
      if (!application.organization_id) return null;
      
      const { data, error } = await supabase
        .from('organizations')
        .select('slug')
        .eq('id', application.organization_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!application.organization_id && !application.organization_slug,
  });

  const getStatusClassName = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'development': return 'bg-purple-500 hover:bg-purple-600';
      case 'maintenance': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'archived': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  const handleRemoveTag = async (tagName: string) => {
    try {
      // In a real implementation, we would use the tag's ID from the database
      // For now, just show a toast message
      toast({
        title: 'Tag removed',
        description: `Tag "${tagName}" was removed from ${application.name}`,
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove tag',
        variant: 'destructive',
      });
    }
  };

  // Generate the correct URL for the application
  const getAppUrl = () => {
    // Prefer to use slug over ID
    if (application.slug) {
      // Use org slug if available, otherwise fall back to ID
      if (application.organization_slug) {
        return `/apps/${application.organization_slug}@${application.slug}`;
      }
      
      if (organization?.slug) {
        return `/apps/${organization.slug}@${application.slug}`;
      }
    }
    
    // Fallback: Use ID
    return `/applications/${application.id}`;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{application.name}</CardTitle>
            {application.favorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-2" />
            )}
          </div>
          <CardDescription className="mt-1">
            {application.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {application.category}
          </Badge>
          {application.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1 group">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <AppWindow className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{application.endpoints_count} endpoints</span>
          </div>
          <div className="flex items-center">
            <CircuitBoard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{application.tools_count} AI tools</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`${getStatusClassName(application.status)} text-white`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
        <Button asChild>
          <Link to={getAppUrl()}>View API</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ApplicationCard;
