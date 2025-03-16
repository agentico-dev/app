
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DetailPageLayout } from '@/components/detail/DetailPageLayout';
import { ResourceHeader } from '@/components/detail/ResourceHeader';
import { ServerResourceCards } from '@/components/servers/detail/ServerResourceCards';
import { ServerTabs } from '@/components/servers/detail/ServerTabs';
import { Server } from '@/types/server';
import { useTags } from '@/contexts/TagsContext';

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
        console.log('Fetching server details for ID:', id);
        
        // Fetch the server directly without attempting to join with user_id
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .eq('id', id)
          .single();
        
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
            onEdit={() => {}}
            onDelete={() => {}}
          />
          
          <ServerResourceCards server={server!} />
          
          <ServerTabs server={server!} />
        </>
      )}
    />
  );
}
