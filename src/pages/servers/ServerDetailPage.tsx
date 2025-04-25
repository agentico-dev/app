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
import Editor from '@monaco-editor/react';
import { FilesIcon, Loader2 } from 'lucide-react';
import { formatJson, isValidJson } from '@/utils/formatter';

export default function ServerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tags } = useTags();
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [manifestId, setManifestId] = useState<bigint | null>(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [useMonaco, setUseMonaco] = useState(true);
  const [contentLanguage, setContentLanguage] = useState<'json' | 'yaml'>('json');

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

  // Fetch code content when code view is toggled
  useEffect(() => {
    const fetchManifestContent = async () => {
      if (showCodeView && manifestId && !codeContent) {
        setIsCodeLoading(true);
        try {
          // response format is: { content: {manifest: string}, status_code: number }
          type ManifestData = {
            content: {
              manifest: string;
            };
            status_code: number;
          };
          
          const { data: manifestData, error } = await supabase
            .rpc('get_generated_manifest', { manifest_id: manifestId });
          
          if (error) throw error;
          
          // Detect content type and set language
          const contentStr = manifestData?.content?.manifest || '';
          detectContentLanguage(contentStr);
          
          // Set content with a small delay to ensure UI is ready
          setTimeout(() => {
            setCodeContent(contentStr);
            setIsCodeLoading(false);
          }, 100);
          
        } catch (error) {
          console.error('Error fetching manifest code:', error);
          toast.error(`Failed to load code content: ${error.message}`);
          setIsCodeLoading(false);
          setUseMonaco(false); // Fallback to textarea on error
        }
      }
    };

    fetchManifestContent();
  }, [showCodeView, manifestId, codeContent]);
  
  // Function to detect content language (JSON or YAML)
  const detectContentLanguage = (content: string) => {
    if (!content.trim()) return;
    
    // Use the formatter util if available, otherwise inline check
    if (isValidJson(content)) {
      setContentLanguage('json');
    } else {
      setContentLanguage('yaml');
    }
  };
  
  // Format content based on language
  const formatContent = () => {
    try {
      if (contentLanguage === 'json') {
        // Use the formatter util if available, otherwise inline format
        const formattedContent = formatJson(codeContent);
        setCodeContent(formattedContent);
        toast.success('Content formatted as JSON');
      } else {
        toast.success('Content formatted as YAML');
      }
    } catch (error) {
      console.error('Error formatting content:', error);
      toast.error('Failed to format content. Invalid syntax.');
    }
  };
  
  // Handle language toggle
  const toggleLanguage = () => {
    setContentLanguage(prev => prev === 'json' ? 'yaml' : 'json');
  };
  
  // Handle editor mounting
  const handleEditorDidMount = () => {
    console.log("Monaco editor mounted successfully");
  };
  
  // Handle editor error
  const handleEditorError = () => {
    console.error("Monaco editor failed to load");
    setUseMonaco(false);
  };

  // Handle code content changes from textarea
  const handleCodeContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeContent(e.target.value);
  };

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
  
  const handleImportServer = async () => {
    if (!server) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // @todo After import, I can update the server status or any other field
    toast.success('Server imported successfully');
  };
  const handleExportServer = async () => {
    if (!server) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // @todo After import, I can update the server status or any other field
    toast.success('Server exported successfully');
  };
  const handleDeployServer = async () => {
    if (!server) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // @todo After import, I can update the server status or any other field
    toast.success('Server deployed successfully');
  };
  const handleUndeployServer = async () => {
    if (!server) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // @todo After import, I can update the server status or any other field
    toast.success('Server undeployed successfully');
  };

  const getStatusColorClass = (status: string) => {
    switch (status?.toLowerCase()) {
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
            isActionsOpen={isActionsOpen}
            setIsActionsOpen={setIsActionsOpen}
            showCodeView={showCodeView}
            setShowCodeView={setShowCodeView}
            handleImport={handleImportServer}
            handleExport={handleExportServer}
            handleDeploy={handleDeployServer}
            handleUndeploy={handleUndeployServer}
          />
          
          {/* <ServerResourceCards server={server!} /> */}
          
          {showCodeView ? (
            <div className="mt-6 border rounded-md overflow-hidden">
              <div className="p-2 bg-muted border-b flex items-center justify-between">
                <div className="flex items-center">
                  <FilesIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Server Code View</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={formatContent} 
                    className="text-xs hover:underline"
                  >
                    Format
                  </button>
                  <button 
                    onClick={toggleLanguage} 
                    className="text-xs hover:underline mx-2"
                  >
                    {contentLanguage.toUpperCase()}
                  </button>
                  {useMonaco && (
                    <button 
                      onClick={() => setUseMonaco(false)} 
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      Switch to plain editor
                    </button>
                  )}
                </div>
              </div>
              <div className="h-[500px]">
                {isCodeLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading code...</span>
                  </div>
                ) : !useMonaco ? (
                  // Textarea fallback
                  <textarea
                    className="w-full h-full p-4 font-mono text-sm bg-background resize-none"
                    value={codeContent}
                    onChange={handleCodeContentChange}
                    spellCheck={false}
                    style={{
                      lineHeight: '1.5',
                      tabSize: 2,
                      whiteSpace: 'pre',
                      overflowY: 'auto',
                    }}
                  />
                ) : (
                  // Monaco editor with error handling
                  <div className="w-full h-full">
                    <Editor
                      height="100%"
                      language={contentLanguage}
                      value={codeContent}
                      options={{
                        readOnly: false,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        formatOnPaste: true,
                        tabSize: 2,
                      }}
                      onMount={handleEditorDidMount}
                      onChange={(value) => setCodeContent(value || '')}
                      onError={handleEditorError}
                      loading={
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Loading editor...</span>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ServerTabs server={server!} />
          )}
        </>
      )}
    />
  );
}
