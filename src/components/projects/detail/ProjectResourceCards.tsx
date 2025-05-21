
import { useEffect, useState } from 'react';
import { CircuitBoard, AppWindow, Server, Calendar, User } from 'lucide-react';
import { ResourceInfoCards } from '../../detail/ResourceInfoCards';
import { format } from 'date-fns';
import { Project } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProjectResourceCardsProps {
  project: Project;
}

export function ProjectResourceCards({ project }: ProjectResourceCardsProps) {
  const [toolsCount, setToolsCount] = useState<number>(project.tools_count || 0);
  const [applicationsCount, setApplicationsCount] = useState<number>(project.applications_count || 0);
  const [serversCount, setServersCount] = useState<number>(project.servers_count || 0);
  const [creatorEmail, setCreatorEmail] = useState<string>(project.user_email || 'Unknown user');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResourceCounts = async () => {
      setIsLoading(true);
      try {
        // Get AI tools count - an object with key 'count'
        const { data: toolCount, error: toolError } = await supabase
          .rpc('count_project_ai_tools', { project_id: project.id })
          .single();
        
        if (toolError) throw toolError;
        
        // Get application IDs for the project
        const { data: appCount, error: appError } = await supabase
          .rpc('count_project_applications', { project_id: project.id })
          .single();
        
        if (appError) throw appError;
        
        // Get server IDs for the project
        const { data: serverCount, error: serverError } = await supabase
          .rpc('count_project_servers', { project_id: project.id })
          .single();
          
        if (serverError) throw serverError;
        
        // Get creator information if not already available
        if (!project.user_email && project.created_by) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', project.created_by)
            .single();
            
          if (!userError && userData) {
            setCreatorEmail(userData.full_name || 'Unknown user');
          }
        }
        
        // Update state with fresh counts - toolsCount is an object with key 'count'
        setToolsCount((toolCount as any)?.count || 0);
        setApplicationsCount((appCount as any).count || 0);
        setServersCount((serverCount as any).count || 0);
        
      } catch (error) {
        console.error('Error fetching resource counts:', error);
        toast.error('Failed to load resource information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResourceCounts();
  }, [project.id, project.created_by, project.user_email]);

  return (
    <ResourceInfoCards 
      cards={[
        {
          title: 'Resources',
          items: [
            {
              icon: <CircuitBoard className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'AI Tools',
              value: isLoading ? '...' : toolsCount,
            },
            {
              icon: <AppWindow className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Applications',
              value: isLoading ? '...' : applicationsCount,
            },
            {
              icon: <Server className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Servers',
              value: isLoading ? '...' : serversCount,
            },
          ],
        },
        {
          title: 'Created By',
          items: [
            {
              icon: <User className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: '',
              value: creatorEmail,
            },
          ],
        },
        {
          title: 'Timeline',
          items: [
            {
              icon: <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Created:',
              value: project.created_at ? format(new Date(project.created_at), 'PPP') : 'Unknown',
            },
            {
              icon: <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />,
              label: 'Updated:',
              value: project.updated_at ? format(new Date(project.updated_at), 'PPP') : 'Unknown',
            },
          ],
        },
      ]}
    />
  );
}
