import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, BarChart3, Briefcase, CircuitBoard, Server, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function Dashboard() {
  const { session } = useAuth();

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['dashboard', 'projects'],
    queryFn: async () => {
      if (!session.user) return [];

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }

      return data;
    },
    enabled: !!session.user,
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      if (!session.user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching activity:', error);
        return [];
      }

      return data;
    },
    enabled: !!session.user,
  });

  const { data: statsSummary, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      if (!session.user) return null;
      
      // For a real app, you would compute these on the server or use a stored procedure
      // For now, we'll fetch the counts directly
      
      const projectsPromise = supabase
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('user_id', session.user.id);
      
      const applicationsPromise = supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('user_id', session.user.id);
      
      const serversPromise = supabase
        .from('servers')
        .select('id', { count: 'exact' })
        .eq('user_id', session.user.id);
      
      const aiToolsPromise = supabase
        .from('ai_tools')
        .select('id', { count: 'exact' })
        .eq('user_id', session.user.id);
      
      const [
        projectsResult, 
        applicationsResult,
        serversResult,
        aiToolsResult
      ] = await Promise.all([
        projectsPromise,
        applicationsPromise,
        serversPromise,
        aiToolsPromise
      ]);
      
      // Handle potential errors
      if (projectsResult.error || applicationsResult.error || 
          serversResult.error || aiToolsResult.error) {
        console.error('Error fetching stats:', {
          projectsError: projectsResult.error,
          applicationsError: applicationsResult.error,
          serversError: serversResult.error,
          aiToolsError: aiToolsResult.error
        });
        
        // Return mock data as fallback
        return {
          projects: { count: 12, trend: '+2 this month', trendUp: true },
          applications: { count: 8, trend: '+1 this week', trendUp: true },
          servers: { count: 23, trend: 'No change', trendUp: null },
          aiTools: { count: 35, trend: '+5 this month', trendUp: true },
        };
      }
      
      return {
        projects: { 
          count: projectsResult.count || 0, 
          trend: '+2 this month', 
          trendUp: true 
        },
        applications: { 
          count: applicationsResult.count || 0, 
          trend: '+1 this week', 
          trendUp: true 
        },
        servers: { 
          count: serversResult.count || 0, 
          trend: 'No change', 
          trendUp: null 
        },
        aiTools: { 
          count: aiToolsResult.count || 0, 
          trend: '+5 this month', 
          trendUp: true 
        },
      };
    },
    enabled: !!session.user,
  });

  // Fallback data in case of loading or error
  const stats = statsLoading || !statsSummary ? {
    projects: { count: 12, trend: '+2 this month', trendUp: true },
    applications: { count: 8, trend: '+1 this week', trendUp: true },
    servers: { count: 23, trend: 'No change', trendUp: null },
    aiTools: { count: 35, trend: '+5 this month', trendUp: true },
  } : statsSummary;

  const projects = projectsLoading || !projectsData ? recentProjects : projectsData;
  const activity = activityLoading || !activityData ? recentActivity : activityData.map(notification => {
    const getIcon = () => {
      const type = notification.type || 'info';
      switch (type) {
        case 'project': return Briefcase;
        case 'application': return CircuitBoard;
        case 'server': return Server;
        case 'user': return Users;
        default: return CircuitBoard;
      }
    };
    
    return {
      icon: getIcon(),
      description: notification.message,
      time: new Date(notification.created_at).toLocaleDateString()
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your AI Tools Hub dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/projects/new">Create new project</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Projects"
          value={stats.projects.count.toString()}
          description="Total projects"
          icon={Briefcase}
          trend={stats.projects.trend}
          trendUp={stats.projects.trendUp}
        />
        <MetricCard 
          title="Applications" 
          value={stats.applications.count.toString()}
          description="Deployed applications"
          icon={CircuitBoard}
          trend={stats.applications.trend}
          trendUp={stats.applications.trendUp}
        />
        <MetricCard 
          title="Servers" 
          value={stats.servers.count.toString()}
          description="Active servers"
          icon={Server}
          trend={stats.servers.trend}
          trendUp={stats.servers.trendUp}
        />
        <MetricCard 
          title="AI Tools" 
          value={stats.aiTools.count.toString()}
          description="Total AI tools"
          icon={BarChart3}
          trend={stats.aiTools.trend}
          trendUp={stats.aiTools.trendUp}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your recently updated projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
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
                    <Badge variant="outline" className="mr-2">
                      {project.status}
                    </Badge>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/projects/${project.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">View project</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <activity.icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
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

// Fallback data
const recentProjects = [
  {
    id: '1',
    name: 'Customer Support Bot',
    tools_count: 8,
    servers_count: 2,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Data Analysis Pipeline',
    tools_count: 12,
    servers_count: 4,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Content Generation System',
    tools_count: 6,
    servers_count: 2,
    status: 'Development',
  },
  {
    id: '4',
    name: 'Recommendation Engine',
    tools_count: 9,
    servers_count: 3,
    status: 'Maintenance',
  },
];

const recentActivity = [
  {
    icon: CircuitBoard,
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
    icon: CircuitBoard,
    description: 'Application "Customer Portal" deployed to production',
    time: '1 day ago',
  },
];

export default Dashboard;
