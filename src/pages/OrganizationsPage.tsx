
import React, { useState, useEffect } from 'react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Building, Users, CreditCard, FolderKanban, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import OrganizationsList from '@/components/organizations/OrganizationsList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';

export default function OrganizationsPage() {
  const { organizations, userOrganizations, isLoading, error, isAuthenticated, createOrganization } = useOrganizations();
  const { session } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  // Set the selected organization when user organizations load
  useEffect(() => {
    if (userOrganizations && userOrganizations.length > 0 && !selectedOrgId) {
      setSelectedOrgId(userOrganizations[0].id);
    }
  }, [userOrganizations, selectedOrgId]);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session.user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create an organization.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newOrg.name) {
      toast({
        title: 'Required field missing',
        description: 'Please provide a name for the organization.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting organization creation...', newOrg);      
      
      await createOrganization.mutateAsync(newOrg);
      
      toast({
        title: 'Success!',
        description: `Organization "${newOrg.name}" was created successfully.`,
      });
      
      // Close the dialog and reset form
      setOpen(false);
      setNewOrg({ name: '', slug: '', description: '' });
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: 'Failed to create organization',
        description: error?.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewOrg({
      ...newOrg,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage your organizations, teams and projects.</p>
        </div>
        <Dialog 
          open={open} 
          onOpenChange={(isOpen) => {
            // Reset the form when dialog is closed
            if (!isOpen) {
              setNewOrg({ name: '', slug: '', description: '' });
            }
            setOpen(isOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={!isAuthenticated}>
              <Plus className="mr-2 h-4 w-4" />
              New Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new organization</DialogTitle>
              <DialogDescription>
                Add a new organization to manage teams, projects, and billing.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOrganization}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newOrg.name}
                    onChange={handleNameChange}
                    placeholder="Acme Inc."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={newOrg.slug}
                    onChange={(e) => setNewOrg({ ...newOrg, slug: e.target.value })}
                    placeholder="acme-inc"
                  />
                  <p className="text-sm text-muted-foreground">
                    Used in URLs: app.agentico.dev/org/{newOrg.slug || 'your-slug'}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOrg.description}
                    onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                    placeholder="A short description of your organization"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting || createOrganization.isPending}>
                  {isSubmitting || createOrganization.isPending ? 'Creating...' : 'Create Organization'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!isAuthenticated && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <Shield className="h-4 w-4 text-amber-500" />
          <AlertTitle>Limited Access Mode</AlertTitle>
          <AlertDescription>
            You're browsing in read-only mode. Sign in to create or manage organizations.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Organizations</TabsTrigger>
          {isAuthenticated && <TabsTrigger value="my-orgs">My Organizations</TabsTrigger>}
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <OrganizationsList organizations={organizations || []} isLoading={isLoading} />
        </TabsContent>
        {isAuthenticated && (
          <TabsContent value="my-orgs" className="space-y-4">
            <OrganizationsList organizations={userOrganizations || []} isLoading={isLoading} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
