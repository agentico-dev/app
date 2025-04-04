
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Briefcase, AppWindow, Server, Shield, Users, Wrench, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { supabase } from '@/integrations/supabase/client';

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

// Animation variants for staggered children animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    } 
  }
};

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

      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Projects"
            value={stats.projects.count.toString()}
            description="Total projects"
            icon={Briefcase}
            trend={stats.projects.trend}
            trendUp={stats.projects.trendUp}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Applications"
            value={stats.applications.count.toString()}
            description="Deployed applications"
            icon={AppWindow}
            trend={stats.applications.trend}
            trendUp={stats.applications.trendUp}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Servers"
            value={stats.servers.count.toString()}
            description="Active servers"
            icon={Server}
            trend={stats.servers.trend}
            trendUp={stats.servers.trendUp}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="AI Tools"
            value={stats.aiTools.count.toString()}
            description="Total AI tools"
            icon={Wrench}
            trend={stats.aiTools.trend}
            trendUp={stats.aiTools.trendUp}
          />
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          className="col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="h-full bg-gradient-to-br from-card to-background/80 backdrop-blur-sm border-opacity-40 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Your recently updated projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.length > 0 ? projects.map((project, index) => (
                  <motion.div 
                    key={project.id} 
                    className="flex items-center justify-between space-x-4 p-2 hover:bg-background/50 rounded-md transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-sm">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.tools_count} tools · {project.servers_count} servers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className={`mr-2 ${
                        project.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 
                        project.status === 'Development' ? 'bg-blue-100 text-blue-800 border-blue-300' : 
                        'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {project.status}
                      </Badge>
                      <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 transition-colors duration-300">
                        <Link to={`/projects/${project.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="sr-only">View project</span>
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No projects yet</p>
                    <Button variant="outline" className="mt-2" asChild>
                      <Link to="/projects/new">Create your first project</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card className="h-full bg-gradient-to-br from-card to-background/80 backdrop-blur-sm border-opacity-40 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions in your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.length > 0 ? activity.map((activity, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-4 p-2 hover:bg-background/50 rounded-md transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-gradient-to-br from-secondary/30 to-background flex items-center justify-center shadow-sm">
                      <activity.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-center py-8 text-muted-foreground">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean | null;
}

function MetricCard({ title, value, description, icon: Icon, trend, trendUp }: MetricCardProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card to-background/80 backdrop-blur-sm border-opacity-40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-sm">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-500 bg-clip-text text-transparent">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`mt-2 flex items-center text-xs ${
            trendUp === true ? 'text-green-500' :
            trendUp === false ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Dashboard;
