import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DetailPageLayout } from '@/components/detail/DetailPageLayout';
import { ResourceHeader } from '@/components/detail/ResourceHeader';
import { ProjectResourceCards } from '@/components/projects/detail/ProjectResourceCards';
import { ProjectTabs } from '@/components/projects/detail/ProjectTabs';
import { Project } from '@/types/project';
import { FilesIcon, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { try_parse } from '@/utils/formatter';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [manifestId, setManifestId] = useState<bigint | null>(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [useMonaco, setUseMonaco] = useState(true);
  const [contentLanguage, setContentLanguage] = useState<'json' | 'yaml'>('json');
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        console.log('Fetching project details for ID/slug:', id);

        let query = supabase.from('projects').select('*');

        // Check if the ID is a UUID format or a slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
          query = query.eq('id', id);
        } else {
          query = query.eq('slug', id);
        }

        const { data, error } = await query.single();

        if (error) {
          console.error('Error fetching project details:', error);
          toast.error(`Failed to load project: ${error.message}`);
          throw error;
        }

        console.log('Fetched project details:', data);
        setProject(data);
        const { data: dataCode, error: dataCodeError } = await supabase
          .rpc('generate_manifest', { project_id: data.id });
          if (!dataCode) {
            console.error('Error fetching project code:', dataCodeError);
            toast.error(`Failed to load project code: ${dataCodeError?.message}`);
            return;
          }
        if (dataCodeError) throw dataCodeError;
        setManifestId(dataCode);
      } catch (error) {
        console.error('Error in project fetch:', error);
        toast.error(`Failed to load project details: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
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
          const contentStr = manifestData?.content.manifest || '';
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
        }
      }
    };

    fetchManifestContent();
  }, [showCodeView, manifestId, codeContent]);
  
  // Function to detect content language (JSON or YAML)
  const detectContentLanguage = (content: string) => {
    if (!content.trim()) return;
    
    // Check if it's valid JSON
    try {
      JSON.parse(content);
      setContentLanguage('json');
      return;
    } catch (e) {
      // If not valid JSON, assume YAML
      setContentLanguage('yaml');
    }
  };
  
  // Format content based on language
  const formatContent = () => {
    try {
      if (contentLanguage === 'json') {
        // Format JSON
        const parsed = JSON.parse(codeContent);
        setCodeContent(JSON.stringify(parsed, null, 2));
        toast.success('Content formatted as JSON');
      } else {
        // For YAML we're just relying on the editor's formatting
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
  const handleEditorDidMount = (editor, monaco) => {
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

  const handleEditProject = () => {
    // Navigate to edit project page using slug
    if (project) {
      navigate(`/projects/${project.slug}/edit`);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };

  const handleImportProject = async () => {
    if (!project) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // @todo After import, I can update the project status or any other field
    toast.success('Project imported successfully');
  };
  const handleExportProject = async () => {
    if (!project) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // @todo After import, I can update the project status or any other field
    toast.success('Project exported successfully');
  };
  const handleDeployProject = async () => {
    if (!project) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // @todo After import, I can update the project status or any other field
    toast.success('Project deployed successfully');
  };
  const handleUndeployProject = async () => {
    if (!project) return;
    // simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // @todo After import, I can update the project status or any other field
    toast.success('Project undeployed successfully');
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Active': return 'tag-green';
      case 'Development': return 'tag-purple';
      case 'Maintenance': return 'tag-yellow';
      case 'Archived': return 'tag-red';
      default: return '';
    }
  };

  return (
    <DetailPageLayout
      isLoading={isLoading}
      resource={project}
      resourceType="Project"
      onGoBack={handleGoBack}
      renderResource={() => (
        <>
          <ResourceHeader
            title={project!.name}
            description={project!.description}
            isFavorite={project!.favorite}
            status={project!.status}
            tags={project!.tags}
            statusColorClass={getStatusColorClass(project!.status)}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            resourceId={project!.id}
            resourceType="Project"
            isActionsOpen={isActionsOpen}
            setIsActionsOpen={setIsActionsOpen}
            showCodeView={showCodeView}
            setShowCodeView={setShowCodeView}
            handleImport={handleImportProject}
            handleExport={handleExportProject}
            handleDeploy={handleDeployProject}
            handleUndeploy={handleUndeployProject}
          />

          <ProjectResourceCards project={project!} />

          {showCodeView ? (
            <div className="mt-6 border rounded-md overflow-hidden">
              <div className="p-2 bg-muted border-b flex items-center justify-between">
                <div className="flex items-center">
                  <FilesIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Project Code View</span>
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
                    <button 
                      onClick={() => setUseMonaco(!useMonaco)} 
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      Switch to {useMonaco ? 'simple' : 'advanced'} editor
                    </button>
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
            <ProjectTabs project={project!} />
          )}
        </>
      )}
    />
  );
}
