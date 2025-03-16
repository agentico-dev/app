
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DetailPageLayout } from '@/components/detail/DetailPageLayout';
import { ResourceHeader } from '@/components/detail/ResourceHeader';
import { ProjectResourceCards } from '@/components/projects/detail/ProjectResourceCards';
import { ProjectTabs } from '@/components/projects/detail/ProjectTabs';
import { Project } from '@/types/project';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          />
          
          <ProjectResourceCards project={project!} />
          
          <ProjectTabs project={project!} />
        </>
      )}
    />
  );
}
