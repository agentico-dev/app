
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Shield, Users, Wrench, Megaphone, AppWindow, Server, Briefcase } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardMetricsGrid } from '@/components/dashboard/DashboardMetrics';
import { ProjectsList } from '@/components/dashboard/ProjectsList';
import { ActivityList } from '@/components/dashboard/ActivityList';

interface ProjectData {
  id: string;
  name: string;
  tools_count: number;
  servers_count: number;
  status: string;
}

interface ActivityData {
  icon: React.ElementType;
  description: string;
  time: string;
}

interface NotificationData {
  type?: string;
  message: string;
  created_at: string;
}

export function Dashboard() {
  const { session } = useAuth();
  const isAuthenticated = !!session.user;

  // Fetch metrics from Supabase
  const { data: metricsData, isLoading: metricsLoading } = useDashboardMetrics();

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['dashboard', 'projects'],
    queryFn: async () => {
      if (!isAuthenticated) return [];

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, tools_count, servers_count, status')
        .order('updated_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching recent projects:', error);
        throw error;
      }

      return data || [];
    },
    enabled: isAuthenticated,
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      if (!isAuthenticated) return [];

      // In a real app, we would fetch actual activity from a dedicated table
      // For now, we'll use mock data
      return [
        {
          icon: Wrench,
          description: 'New AI Tool "Text Summarizer" was created',
          time: '2 hours ago',
        },
        {
          icon: Server,
          description: 'Server "NLP-Processor-01" was restarted',
          time: '4 hours ago',
        },
        {
          icon: Users,
          description: 'User "Alex Kim" was added to "Data Analysis Pipeline" project',
          time: '6 hours ago',
        },
        {
          icon: AppWindow,
          description: 'Application "Customer Portal" deployed to production',
          time: '1 day ago',
        },
      ];
    },
    enabled: isAuthenticated,
  });

  // Fallback to mock data if real data isn't available yet
  const mockStats = {
    projects: { count: 0, trend: 'No data yet', trendUp: null },
    applications: { count: 0, trend: 'No data yet', trendUp: null },
    servers: { count: 0, trend: 'No data yet', trendUp: null },
    aiTools: { count: 0, trend: 'No data yet', trendUp: null },
  };

  const stats = metricsLoading || !metricsData ? mockStats : metricsData;
  const projects = projectsLoading || !projectsData ? [] : projectsData;
  const activity = activityLoading || !activityData ? [] : activityData;

  const transformNotificationToActivity = (notification: NotificationData): ActivityData => {
    const getIcon = () => {
      const type = notification.type || 'info';
      switch (type) {
        case 'project': return Briefcase;
        case 'application': return AppWindow;
        case 'server': return Server;
        case 'user': return Users;
        default: return Megaphone;
      }
    };

    return {
      icon: getIcon(),
      description: notification.message,
      time: new Date(notification.created_at).toLocaleDateString()
    };
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your AI Tools Hub dashboard
          </p>
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button 
            asChild
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
          >
            <Link to={isAuthenticated ? "/projects/new" : "/login"}>Create new project</Link>
          </Button>
        </motion.div>
      </div>
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Alert variant="default" className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
              <Shield className="h-4 w-4 text-amber-500" />
              <AlertDescription>
                You are currently in limited access mode. Some features may be restricted.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

      <DashboardMetricsGrid metrics={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          className="col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <ProjectsList projects={projects} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <ActivityList activities={activity} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
