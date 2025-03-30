import React, { useState } from 'react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useEnvironments } from '@/hooks/useEnvironments';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';

export default function EnvironmentsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const isAuthenticated = !!session.user;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const { organizations, userOrganizations } = useOrganizations();
  const { environments, isLoading, createEnvironment } = useEnvironments(selectedOrgId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEnvironment, setNewEnvironment] = useState({
    name: '',
    description: '',
    cluster_url: '',
    credential_type: 'token',
    credential_token: '',
    credential_certificate: '',
    status: 'active'
  });

  React.useEffect(() => {
    if (userOrganizations && userOrganizations.length > 0 && !selectedOrgId) {
      setSelectedOrgId(userOrganizations[0].id);
    }
  }, [userOrganizations, selectedOrgId]);

  const handleCreateEnvironment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session.user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create an environment.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newEnvironment.name || !newEnvironment.cluster_url) {
      toast({
        title: 'Required fields missing',
        description: 'Please provide a name and cluster URL for the environment.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedOrgId) {
      toast({
        title: 'Organization required',
        description: 'Please select an organization for this environment.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        ...newEnvironment,
        organization_id: selectedOrgId,
        credential_type: newEnvironment.credential_type as 'token' | 'certificate' | 'both'
      };
      
      await createEnvironment.mutateAsync(payload);
      
      setOpen(false);
      setNewEnvironment({
        name: '',
        description: '',
        cluster_url: '',
        credential_type: 'token',
        credential_token: '',
        credential_certificate: '',
        status: 'active'
      });
    } catch (error: any) {
      console.error('Error creating environment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Environments</h1>
          <p className="text-muted-foreground">Manage your Kubernetes environments for deployments.</p>
        </div>
        
        <Dialog 
          open={open} 
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setNewEnvironment({
                name: '',
                description: '',
                cluster_url: '',
                credential_type: 'token',
                credential_token: '',
                credential_certificate: '',
                status: 'active'
              });
            }
            setOpen(isOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={!isAuthenticated}>
              <Plus className="mr-2 h-4 w-4" />
              New Environment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new environment</DialogTitle>
              <DialogDescription>
                Add a new Kubernetes environment for deployments.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEnvironment}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <OrganizationSelector
                    selectedOrgId={selectedOrgId}
                    onOrganizationChange={setSelectedOrgId}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Environment Name</Label>
                  <Input
                    id="name"
                    value={newEnvironment.name}
                    onChange={(e) => setNewEnvironment({ ...newEnvironment, name: e.target.value })}
                    placeholder="Production"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEnvironment.description}
                    onChange={(e) => setNewEnvironment({ ...newEnvironment, description: e.target.value })}
                    placeholder="Production Kubernetes cluster"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newEnvironment.status}
                    onValueChange={(value) => setNewEnvironment({ ...newEnvironment, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cluster_url">Cluster URL</Label>
                  <Input
                    id="cluster_url"
                    value={newEnvironment.cluster_url}
                    onChange={(e) => setNewEnvironment({ ...newEnvironment, cluster_url: e.target.value })}
                    placeholder="https://k8s.example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credential_type">Credential Type</Label>
                  <Select
                    value={newEnvironment.credential_type}
                    onValueChange={(value) => setNewEnvironment({ ...newEnvironment, credential_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select credential type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="token">Token</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(newEnvironment.credential_type === 'token' || newEnvironment.credential_type === 'both') && (
                  <div className="grid gap-2">
                    <Label htmlFor="credential_token">Access Token</Label>
                    <Input
                      id="credential_token"
                      type="password"
                      value={newEnvironment.credential_token}
                      onChange={(e) => setNewEnvironment({ ...newEnvironment, credential_token: e.target.value })}
                      placeholder="kubeconfig token"
                    />
                  </div>
                )}
                {(newEnvironment.credential_type === 'certificate' || newEnvironment.credential_type === 'both') && (
                  <div className="grid gap-2">
                    <Label htmlFor="credential_certificate">Certificate</Label>
                    <Textarea
                      id="credential_certificate"
                      value={newEnvironment.credential_certificate}
                      onChange={(e) => setNewEnvironment({ ...newEnvironment, credential_certificate: e.target.value })}
                      placeholder="Certificate content"
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting || !selectedOrgId}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : 'Create Environment'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!isAuthenticated && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Limited Access Mode</AlertTitle>
          <AlertDescription>
            You're browsing in read-only mode. Sign in to create or manage environments.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Organization Environments</CardTitle>
                <CardDescription>
                  Select an organization to view its environments.
                </CardDescription>
              </div>
              <OrganizationSelector
                selectedOrgId={selectedOrgId}
                onOrganizationChange={setSelectedOrgId}
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !environments || environments.length === 0 ? (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-semibold">No Environments</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedOrgId ? 'This organization doesn\'t have any environments yet.' : 'Select an organization to view its environments.'}
                </p>
                {isAuthenticated && selectedOrgId && (
                  <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Environment
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cluster URL</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {environments.map((env) => (
                      <TableRow key={env.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/settings/environments/${env.id}`)}>
                        <TableCell className="font-medium">{env.name}</TableCell>
                        <TableCell>{getStatusBadge(env.status)}</TableCell>
                        <TableCell className="font-mono text-xs">{env.cluster_url}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(env.created_at), { addSuffix: true })}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/settings/environments/${env.id}`);
                          }}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
