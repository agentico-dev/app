
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { AppWindow, CircuitBoard, Filter, Plus, Search, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Application {
  id: string;
  name: string;
  description: string;
  category: string;
  endpointsCount: number;
  toolsCount: number;
  status: 'Active' | 'Development' | 'Maintenance' | 'Archived';
  favorite: boolean;
  tags: string[];
}

const mockApplications: Application[] = [
  {
    id: '1',
    name: 'Customer Support Portal',
    description: 'AI-powered chat interface for customer support',
    category: 'Customer Service',
    endpointsCount: 8,
    toolsCount: 5,
    status: 'Active',
    favorite: true,
    tags: ['customer-service', 'chatbot', 'production'],
  },
  {
    id: '2',
    name: 'Content Generator',
    description: 'Automated content creation for marketing materials',
    category: 'Marketing',
    endpointsCount: 12,
    toolsCount: 7,
    status: 'Active',
    favorite: false,
    tags: ['content', 'marketing', 'ai-writing'],
  },
  {
    id: '3',
    name: 'Data Analysis Dashboard',
    description: 'Visual analytics of business metrics with predictive insights',
    category: 'Business Intelligence',
    endpointsCount: 15,
    toolsCount: 8,
    status: 'Development',
    favorite: true,
    tags: ['analytics', 'dashboard', 'data-visualization'],
  },
  {
    id: '4',
    name: 'Document Processor',
    description: 'Extract information from documents and forms',
    category: 'Document Management',
    endpointsCount: 6,
    toolsCount: 4,
    status: 'Active',
    favorite: false,
    tags: ['document', 'extraction', 'ocr'],
  },
  {
    id: '5',
    name: 'Recommendation API',
    description: 'Product and content recommendation engine',
    category: 'E-commerce',
    endpointsCount: 5,
    toolsCount: 3,
    status: 'Development',
    favorite: false,
    tags: ['recommendations', 'personalization', 'ml'],
  },
  {
    id: '6',
    name: 'Image Recognition Service',
    description: 'Identify objects and features in images',
    category: 'Computer Vision',
    endpointsCount: 9,
    toolsCount: 5,
    status: 'Active',
    favorite: true,
    tags: ['vision', 'image-processing', 'detection'],
  },
];

export function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && app.favorite;
    if (activeFilter === 'active') return matchesSearch && app.status === 'Active';
    if (activeFilter === 'customer-service') return matchesSearch && app.category === 'Customer Service';
    if (activeFilter === 'marketing') return matchesSearch && app.category === 'Marketing';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">
            Manage your external API interfaces and applications
          </p>
        </div>
        <Button asChild>
          <Link to="/applications/new">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-8 w-full md:max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveFilter(null)}>
              All Applications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('favorite')}>
              Favorites
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setActiveFilter('customer-service')}>
              Customer Service
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('marketing')}>
              Marketing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.filter(a => a.favorite).map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.slice(0, 3).map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{application.name}</CardTitle>
            {application.favorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-2" />
            )}
          </div>
          <CardDescription className="mt-1">
            {application.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {application.category}
          </Badge>
          {application.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <AppWindow className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{application.endpointsCount} endpoints</span>
          </div>
          <div className="flex items-center">
            <CircuitBoard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{application.toolsCount} AI tools</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`
          ${application.status === 'Active' ? 'tag-green' : ''}
          ${application.status === 'Development' ? 'tag-purple' : ''}
          ${application.status === 'Maintenance' ? 'tag-yellow' : ''}
          ${application.status === 'Archived' ? 'tag-red' : ''}
        `}>
          {application.status}
        </Badge>
        <Button asChild>
          <Link to={`/applications/${application.id}`}>View API</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ApplicationsPage;
