
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, BarChart3, Briefcase, CircuitBoard, Server, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export function Dashboard() {
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
          value="12"
          description="Total projects"
          icon={Briefcase}
          trend="+2 this month"
          trendUp={true}
        />
        <MetricCard 
          title="Applications" 
          value="8" 
          description="Deployed applications"
          icon={CircuitBoard}
          trend="+1 this week"
          trendUp={true}
        />
        <MetricCard 
          title="Servers" 
          value="23" 
          description="Active servers"
          icon={Server}
          trend="No change"
          trendUp={null}
        />
        <MetricCard 
          title="AI Tools" 
          value="35" 
          description="Total AI tools"
          icon={BarChart3}
          trend="+5 this month"
          trendUp={true}
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
              {recentProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.tools} tools · {project.servers} servers
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
              {recentActivity.map((activity, index) => (
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

const recentProjects = [
  {
    id: '1',
    name: 'Customer Support Bot',
    tools: 8,
    servers: 2,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Data Analysis Pipeline',
    tools: 12,
    servers: 4,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Content Generation System',
    tools: 6,
    servers: 2,
    status: 'Development',
  },
  {
    id: '4',
    name: 'Recommendation Engine',
    tools: 9,
    servers: 3,
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
