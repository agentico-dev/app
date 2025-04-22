
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

// Helper to format date ranges for Supabase queries
const getDateRanges = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Current month range (start to now)
  const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString();
  const currentMonthEnd = now.toISOString();
  
  // Previous month range
  const prevMonthStart = new Date(currentYear, currentMonth - 1, 1).toISOString();
  const prevMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999).toISOString();
  
  return { currentMonthStart, currentMonthEnd, prevMonthStart, prevMonthEnd };
};

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      try {
        const { currentMonthStart, currentMonthEnd, prevMonthStart, prevMonthEnd } = getDateRanges();
        
        // Current month metrics
        const { count: projectsCount, error: projectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
          
        // Previous month metrics
        const { count: prevProjectsCount, error: prevProjectsError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', prevMonthEnd);
          
        if (projectsError) throw projectsError;
        if (prevProjectsError) throw prevProjectsError;

        // Applications metrics
        const { count: applicationsCount, error: applicationsError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true });
          
        const { count: prevApplicationsCount, error: prevApplicationsError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', prevMonthEnd);
          
        if (applicationsError) throw applicationsError;
        if (prevApplicationsError) throw prevApplicationsError;

        // Servers metrics
        const { count: serversCount, error: serversError } = await supabase
          .from('servers')
          .select('*', { count: 'exact', head: true });
          
        const { count: prevServersCount, error: prevServersError } = await supabase
          .from('servers')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', prevMonthEnd);
          
        if (serversError) throw serversError;
        if (prevServersError) throw prevServersError;

        // AI tools metrics
        const { count: aiToolsCount, error: aiToolsError } = await supabase
          .from('ai_tools')
          .select('*', { count: 'exact', head: true });
          
        const { count: prevAiToolsCount, error: prevAiToolsError } = await supabase
          .from('ai_tools')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', prevMonthEnd);
          
        if (aiToolsError) throw aiToolsError;
        if (prevAiToolsError) throw prevAiToolsError;

        // Calculate real trends
        const calculateTrend = (current: number, previous: number): { trend: string; trendUp: boolean | null } => {
          if (current === 0) return { trend: 'No data yet', trendUp: null };
          
          if (previous === 0) {
            if (current > 0) return { trend: 'New this month', trendUp: true };
            return { trend: 'No change', trendUp: null };
          }
          
          const diff = current - previous;
          if (diff === 0) return { trend: 'No change', trendUp: null };
          
          const percentage = Math.round((diff / previous) * 100);
          
          if (diff > 0) {
            return { 
              trend: `+${diff} (${percentage}%) this month`, 
              trendUp: true 
            };
          } else {
            return { 
              trend: `${diff} (${Math.abs(percentage)}%) this month`, 
              trendUp: false 
            };
          }
        };

        // New items this month calculation
        const newProjectsThisMonth = projectsCount - prevProjectsCount;
        const newAppsThisMonth = applicationsCount - prevApplicationsCount;
        const newServersThisMonth = serversCount - prevServersCount;
        const newToolsThisMonth = aiToolsCount - prevAiToolsCount;

        return {
          projects: { 
            count: projectsCount || 0, 
            ...calculateTrend(projectsCount || 0, prevProjectsCount || 0) 
          },
          applications: { 
            count: applicationsCount || 0, 
            ...calculateTrend(applicationsCount || 0, prevApplicationsCount || 0) 
          },
          servers: { 
            count: serversCount || 0, 
            ...calculateTrend(serversCount || 0, prevServersCount || 0) 
          },
          aiTools: { 
            count: aiToolsCount || 0, 
            ...calculateTrend(aiToolsCount || 0, prevAiToolsCount || 0) 
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
