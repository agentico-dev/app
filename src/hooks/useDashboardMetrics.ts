
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MetricSummary {
  count: number;
  trend: string;
  trendUp: boolean | null;
}

export interface DashboardMetrics {
  projects: MetricSummary;
  applications: MetricSummary;
  servers: MetricSummary;
  aiTools: MetricSummary;
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      try {
        // Fetch projects count
        const { count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        if (projectsError) throw projectsError;

        // Fetch applications count
        const { count: applicationsCount, error: applicationsError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true });

        if (applicationsError) throw applicationsError;

        // Fetch servers count
        const { count: serversCount, error: serversError } = await supabase
          .from('servers')
          .select('*', { count: 'exact', head: true });

        if (serversError) throw serversError;

        // Fetch AI tools count
        const { count: aiToolsCount, error: aiToolsError } = await supabase
          .from('ai_tools')
          .select('*', { count: 'exact', head: true });

        if (aiToolsError) throw aiToolsError;

        // Calculate trends (in a real app, we'd compare with previous period data)
        // For now we'll use placeholder trends until we implement time-based comparison
        const calculateTrend = (count: number): { trend: string; trendUp: boolean | null } => {
          if (count === 0) return { trend: 'No data yet', trendUp: null };
          if (count < 5) return { trend: 'New', trendUp: null };
          if (Math.random() > 0.5) return { trend: `+${Math.floor(Math.random() * 5)} this month`, trendUp: true };
          if (Math.random() > 0.5) return { trend: `No change`, trendUp: null };
          return { trend: `-${Math.floor(Math.random() * 3)} this month`, trendUp: false };
        };

        return {
          projects: { 
            count: projectsCount || 0, 
            ...calculateTrend(projectsCount || 0) 
          },
          applications: { 
            count: applicationsCount || 0, 
            ...calculateTrend(applicationsCount || 0) 
          },
          servers: { 
            count: serversCount || 0, 
            ...calculateTrend(serversCount || 0) 
          },
          aiTools: { 
            count: aiToolsCount || 0, 
            ...calculateTrend(aiToolsCount || 0) 
          }
        };
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        throw error;
      }
    },
    // Refresh every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
