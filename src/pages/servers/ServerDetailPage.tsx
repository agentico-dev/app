
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DetailPageLayout } from '@/components/detail/DetailPageLayout';
import { ResourceHeader } from '@/components/detail/ResourceHeader';
import { ServerResourceCards } from '@/components/servers/detail/ServerResourceCards';
import { ServerTabs } from '@/components/servers/detail/ServerTabs';
import { Server } from '@/types/server';
import { useTags } from '@/contexts/TagsContext';
import { Badge } from '@/components/ui/badge';

export default function ServerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tags } = useTags();

  useEffect(() => {
    const fetchServerDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching server details for ID/slug:', id);
        
        let query = supabase.from('servers').select('*');
        
        // Check if the ID is a UUID format or a slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
          query = query.eq('id', id);
        } else {
          query = query.eq('slug', id);
        }
        
        const { data, error } = await query.single();
        
        if (error) {
          console.error('Error fetching server details:', error);
          toast.error(`Failed to load server: ${error.message}`);
          throw error;
        }
        
        console.log('Fetched server details:', data);
        setServer(data as Server);
      } catch (error) {
        console.error('Error in server fetch:', error);
        toast.error('Failed to load server details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServerDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEditServer = () => {
    // Navigate to edit server page using slug
    if (server) {
      navigate(`/servers/${server.slug}/edit`);
    }
  };

  const handleDeleteServer = async () => {
    if (!server) return;
    
    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', server.id);
      
      if (error) throw error;
      
      toast.success('Server deleted successfully');
      navigate('/servers');
    } catch (error: any) {
      console.error('Error deleting server:', error);
      toast.error(`Failed to delete server: ${error.message}`);
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'deprecated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const renderTagBadges = () => {
    return server!.tags?.map((tagId) => {
      const tagName = tags.find(t => t.id === tagId)?.name || 'Unknown';
      return (
        <Badge key={tagId} variant="secondary">{tagName}</Badge>
      );
    });
  };

  return (
    <DetailPageLayout
      isLoading={isLoading}
      resource={server}
      resourceType="Server"
      onGoBack={handleGoBack}
      renderResource={() => (
        <>
          <ResourceHeader
            title={server!.name}
            description={server!.description}
            isFavorite={server!.favorite}
            status={server!.status}
            tags={[
              <Badge key="type" variant="outline">{server!.type}</Badge>,
              ...renderTagBadges()
            ]}
            statusColorClass={getStatusColorClass(server!.status)}
            onEdit={handleEditServer}
            onDelete={handleDeleteServer}
            resourceId={server!.id}
            resourceType="Server"
          />
          
          <ServerResourceCards server={server!} />
          
          <ServerTabs server={server!} />
        </>
      )}
    />
  );
}
