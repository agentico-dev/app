
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Users, CreditCard, Folder, ArrowLeft, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrganizationMembers } from '@/hooks/useOrganizations';
import { OrganizationTeamsTab } from '@/components/organizations/OrganizationTeamsTab';
import { OrganizationBillingTab } from '@/components/organizations/OrganizationBillingTab';
import { OrganizationProjectsTab } from '@/components/organizations/OrganizationProjectsTab';

export default function OrganizationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const isAuthenticated = !!session.user;

  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Organization slug is required');
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { members, isLoading: membersLoading } = useOrganizationMembers(organization?.id);

  // Check if the current user is a member
  const userMember = members?.find(m => m.user_id === session.user?.id);
  const isOrgMember = !!userMember;

  if (orgLoading) {
    return (
      <div className="container py-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container py-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate('/orgs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Organizations
        </Button>
        <Card className="p-8 flex flex-col items-center justify-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Organization not found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            The organization you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/orgs')}>
            View All Organizations
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/orgs')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Organizations
      </Button>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
          <p className="text-muted-foreground">{organization.description || 'No description available'}</p>
        </div>
      </div>

      {!isAuthenticated && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <Shield className="h-4 w-4 text-amber-500" />
          <AlertTitle>Limited Access Mode</AlertTitle>
          <AlertDescription>
            You're browsing in read-only mode. Sign in to manage this organization.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams">
            <Users className="h-4 w-4 mr-2" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="projects">
            <Folder className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams">
          <OrganizationTeamsTab 
            organization={organization} 
            members={members || []} 
            isLoading={membersLoading}
            isAuthenticated={isAuthenticated}
            isOrgMember={isOrgMember}
          />
        </TabsContent>
        
        <TabsContent value="billing">
          <OrganizationBillingTab 
            organization={organization}
            isAuthenticated={isAuthenticated} 
            isOrgMember={isOrgMember}
          />
        </TabsContent>
        
        <TabsContent value="projects">
          <OrganizationProjectsTab 
            organization={organization}
            isAuthenticated={isAuthenticated}
            isOrgMember={isOrgMember}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
