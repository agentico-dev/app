import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Plus, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Application, ApplicationStatus } from '@/types/application';
import { FilterControls } from '@/components/applications/FilterControls';
import { ApplicationsTabContent } from '@/components/applications/ApplicationsTabContent';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock data to use while fixing Supabase issues
const mockApplications: Application[] = [
  {
    id: '1',
    name: 'Customer Portal API',
    description: 'API for customer portal integration',
    category: 'Web API',
    status: 'active',
    favorite: true,
    endpoints_count: 24,
    tools_count: 3,
    tags: ['important', 'customer-facing'],
    created_at: '2023-06-15T10:30:00Z',
    updated_at: '2023-08-20T14:45:00Z'
  },
  {
    id: '2',
    name: 'Payment Processing Service',
    description: 'Service for handling payment processing',
    category: 'Microservice',
    status: 'development',
    favorite: false,
    endpoints_count: 8,
    tools_count: 2,
    tags: ['finance', 'security'],
    created_at: '2023-07-10T09:15:00Z',
    updated_at: '2023-08-18T11:20:00Z'
  },
  {
    id: '3',
    name: 'Inventory Management System',
    description: 'Inventory tracking and management API',
    category: 'Internal API',
    status: 'maintenance',
    favorite: true,
    endpoints_count: 16,
    tools_count: 5,
    tags: ['inventory', 'warehouse'],
    created_at: '2023-05-22T08:45:00Z',
    updated_at: '2023-08-15T16:30:00Z'
  }
];

export function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { session } = useAuth();
  const isAuthenticated = !!session.user;

  // Query to fetch applications - using mock data until Supabase issues are fixed
  const { data: applications = mockApplications, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      try {
        // We'll use mock data for now instead of hitting Supabase
        // until the Database types are properly set up
        return mockApplications;
        
        // This code would be used once Supabase issues are fixed:
        /*
        const { data, error } = await supabase
          .from('applications')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        return data.map((app) => ({
          id: app.id,
          name: app.name,
          description: app.description || '',
          category: app.category || 'Other',
          status: (app.status || 'active').toLowerCase() as ApplicationStatus,
          favorite: app.favorite || false,
          endpoints_count: app.endpoints_count || 0,
          tools_count: app.tools_count || 0,
          tags: app.tags || [],
          created_at: app.created_at,
          updated_at: app.updated_at
        }));
        */
      } catch (err) {
        console.error('Unexpected error fetching applications:', err);
        toast({
          title: 'Unexpected error',
          description: 'Failed to load applications. Please try again later.',
          variant: 'destructive',
        });
        return mockApplications; // Fallback to mock data on error
      }
    }
  });

  // Filter applications based on search query and active filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && app.favorite;
    if (activeFilter === 'active') return matchesSearch && app.status === 'active';
    if (activeFilter === 'category') return matchesSearch && app.category === activeFilter;
    
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
          <Link to={isAuthenticated ? "/applications/new" : "/login"}>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>
        {!isAuthenticated && (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <Shield className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              You are currently in limited access mode. Some features may be restricted.
            </AlertDescription>
          </Alert>
        )}

      <FilterControls 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        applications={applications}
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <ApplicationsTabContent 
            isLoading={isLoading}
            error={error}
            applications={filteredApplications}
            tabValue="all"
          />
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <ApplicationsTabContent 
            isLoading={isLoading}
            error={error}
            applications={filteredApplications}
            tabValue="favorites"
          />
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <ApplicationsTabContent 
            isLoading={isLoading}
            error={error}
            applications={filteredApplications}
            tabValue="recent"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ApplicationsPage;
