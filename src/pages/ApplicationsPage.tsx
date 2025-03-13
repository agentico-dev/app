import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Plus, Shield, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Application, ApplicationStatus } from '@/types/application';
import { FilterControls } from '@/components/applications/FilterControls';
import { ApplicationsTabContent } from '@/components/applications/ApplicationsTabContent';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

export function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { session, signOut } = useAuth();
  const isAuthenticated = !!session.user;

  // Query to fetch applications from Supabase
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });

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
          created_at: app.created_at || new Date().toISOString(),
          updated_at: app.updated_at || new Date().toISOString()
        }));
      } catch (err) {
        console.error('Unexpected error fetching applications:', err);
        toast({
          title: 'Unexpected error',
          description: 'Failed to load applications. Please try again later.',
          variant: 'destructive',
        });
        return [];
      }
    },
    enabled: isAuthenticated
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

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">
            Manage your external API interfaces and applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to={isAuthenticated ? "/applications/new" : "/login"}>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Link>
          </Button>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          )}
        </div>
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
            applications={filteredApplications.filter(a => a.favorite)}
            tabValue="favorites"
          />
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <ApplicationsTabContent 
            isLoading={isLoading}
            error={error}
            applications={[...filteredApplications].sort((a, b) => 
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            ).slice(0, 6)}
            tabValue="recent"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ApplicationsPage;
