
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DetailPageLayout } from '@/components/detail/DetailPageLayout';
import { ResourceHeader } from '@/components/detail/ResourceHeader';
import { ProjectResourceCards } from '@/components/projects/detail/ProjectResourceCards';
import { ProjectTabs } from '@/components/projects/detail/ProjectTabs';
import { Project } from '@/types/project';
import Editor from '@monaco-editor/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Code, Download, FileUp, FilesIcon, Import, Rocket, Upload } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import CodeEditor from '@/components/editor/CodeEditor';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);
  const [codeContent, setCodeContent] = useState('');

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
        
        // Set initial code content
        setCodeContent(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('Error in project fetch:', error);
        toast.error('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

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
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <Collapsible 
              open={isActionsOpen} 
              onOpenChange={setIsActionsOpen} 
              className="w-full sm:w-auto"
            >
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions <ChevronDown className={`h-4 w-4 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <Toggle 
                  pressed={showCodeView} 
                  onPressedChange={setShowCodeView}
                  aria-label="Toggle code view"
                  className="ml-2"
                >
                  <Code className="h-4 w-4 mr-1" /> Code View
                </Toggle>
              </div>
              <CollapsibleContent className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleImportProject}
                  className="flex items-center"
                >
                  <Import className="h-4 w-4 mr-1" /> Import
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportProject}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDeployProject}
                  className="flex items-center"
                >
                  <Rocket className="h-4 w-4 mr-1" /> Deploy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUndeployProject}
                  className="flex items-center"
                >
                  <Rocket className="h-4 w-4 mr-1" /> Undeploy
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>

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
          />

          <ProjectResourceCards project={project!} />

          {showCodeView ? (
            <div className="mt-6 border rounded-md overflow-hidden">
              <div className="p-2 bg-muted border-b flex items-center">
                <FilesIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Project Code View</span>
              </div>
              <div className="h-[500px]">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  defaultValue={codeContent}
                  options={{
                    readOnly: false,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                  onChange={(value) => setCodeContent(value || '')}
                />
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
