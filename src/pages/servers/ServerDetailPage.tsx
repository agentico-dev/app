
import { useNavigate, useParams } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DetailPageLayout } from '@/components/detail/DetailPageLayout';
import { ResourceHeader } from '@/components/detail/ResourceHeader';
import { ServerTabs } from '@/components/servers/detail/ServerTabs';
import { useTags } from '@/contexts/TagsContext';
import { Badge } from '@/components/ui/badge';
import { ManifestCodeViewer } from '@/components/servers/detail/ManifestCodeViewer';
import { useServerManifest } from '@/hooks/servers/useServerManifest';
import { getStatusColorClass } from '@/components/servers/detail/utils/serverUtils';

export default function ServerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tags } = useTags();
  
  const {
    server,
    isLoading,
    manifestId,
    isActionsOpen,
    setIsActionsOpen,
    showCodeView,
    setShowCodeView,
    handleImport,
    handleExport,
    handleDeploy,
    handleUndeploy
  } = useServerManifest(id);

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
            isActionsOpen={isActionsOpen}
            setIsActionsOpen={setIsActionsOpen}
            showCodeView={showCodeView}
            setShowCodeView={setShowCodeView}
            handleImport={handleImport}
            handleExport={handleExport}
            handleDeploy={handleDeploy}
            handleUndeploy={handleUndeploy}
          />
          
          {showCodeView ? (
            <ManifestCodeViewer manifestId={manifestId} isLoading={isLoading} />
          ) : (
            <ServerTabs server={server!} />
          )}
        </>
      )}
    />
  );
}
