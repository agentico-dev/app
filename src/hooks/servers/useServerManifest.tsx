
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Server } from '@/types/server';

interface UseServerManifestResult {
  server: Server | null;
  isLoading: boolean;
  manifestId: bigint | null;
  isActionsOpen: boolean;
  setIsActionsOpen: (open: boolean) => void;
  showCodeView: boolean;
  setShowCodeView: (show: boolean) => void;
  handleImport: () => Promise<void>;
  handleExport: () => Promise<void>;
  handleDeploy: () => Promise<void>;
  handleUndeploy: () => Promise<void>;
}

export function useServerManifest(id: string | undefined): UseServerManifestResult {
  const [server, setServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);
  const [manifestId, setManifestId] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchServerDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching server details for ID/slug:', id);
        
        let query = supabase.from('servers')
          .select(`
            *,
            project_servers!inner (
              project_id
            )
          `);
        
        // Check if the ID is a UUID format or a slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
          query = query.eq('id', id);
        } else {
          query = query.eq('slug', id);
        }
        
        let { data, error } = await query;
        console.log('Initial query result:', data, error);
        
        if (error || !data || data.length === 0) {
          // If no results found with inner join, try without the join
          query = supabase.from('servers').select('*');
          if (isUuid) {
            query = query.eq('id', id);
          } else {
            query = query.eq('slug', id);
          }
          
          const result = await query.single();
          data = result.data;
          error = result.error;
        }
        console.log('Fallback query result:', data, error);
        
        if (error) {
          console.error('Error fetching server details:', error);
          toast.error(`Failed to load server: ${error.message}`);
          throw error;
        }
        
        // Process the data to extract project_id if available
        let serverData;
        if (Array.isArray(data) && data.length > 0) {
          const firstResult = data[0];
          // Extract the project_id if available
          const projectId = firstResult.project_servers?.length > 0 
            ? firstResult.project_servers[0].project_id 
            : null;
            
          // Create the server object with project_id
          serverData = {
            ...firstResult,
            project_id: projectId
          };
          delete serverData.project_servers;
        } else {
          serverData = data;
        }
        
        console.log('Fetched server details:', serverData);
        setServer(serverData as Server);
        const { data: dataCode, error: dataCodeError } = await supabase
          .rpc('generate_manifest', { server_id: serverData.id });

        if (dataCodeError) {
          console.error('Error fetching server code:', dataCodeError);
          toast.error(`Failed to load server code: ${dataCodeError.message}`);
          return;
        }
        
        setManifestId(dataCode);
      } catch (error) {
        console.error('Error in server fetch:', error);
        toast.error('Failed to load server details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServerDetails();
  }, [id]);

  const handleImport = async () => {
    if (!server) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success('Server imported successfully');
  };
  
  const handleExport = async () => {
    if (!server) return;
    // simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success('Server exported successfully');
  };
  
  const handleDeploy = async () => {
    if (!server) return;
    // simulate deploy process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success('Server deployed successfully');
  };
  
  const handleUndeploy = async () => {
    if (!server) return;
    // simulate undeploy process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success('Server undeployed successfully');
  };

  return {
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
  };
}
