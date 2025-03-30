
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useEnvironment } from '@/hooks/useEnvironments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Check, Clock, Edit, Save, Server, Trash2, User, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { DetailPageLayout } from '@/components/detail/DetailPageLayout';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { handleSupabaseError } from '@/utils/supabaseHelpers';
import { formatRelative } from 'date-fns';

export default function EnvironmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { environment, isLoading } = useEnvironment(id);
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEnvironment, setEditedEnvironment] = useState({
    name: '',
    description: '',
    status: '',
    cluster_url: '',
    credential_type: '',
    credential_token: '',
    credential_certificate: '',
  });

  // Initialize edit form when environment data is loaded
  React.useEffect(() => {
    if (environment) {
      setEditedEnvironment({
        name: environment.name,
        description: environment.description || '',
        status: environment.status,
        cluster_url: environment.cluster_url,
        credential_type: environment.credential_type,
        credential_token: environment.credential_token || '',
        credential_certificate: environment.credential_certificate || '',
      });
    }
  }, [environment]);

  const updateEnvironmentMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Environment ID is required');
      
      const { data, error } = await supabase
        .from('environments')
        .update({
          name: editedEnvironment.name,
          description: editedEnvironment.description || null,
          status: editedEnvironment.status,
          cluster_url: editedEnvironment.cluster_url,
          credential_type: editedEnvironment.credential_type as 'token' | 'certificate' | 'both',
          credential_token: editedEnvironment.credential_token || null,
          credential_certificate: editedEnvironment.credential_certificate || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environment', id] });
      toast({
        title: 'Environment updated',
        description: 'The environment has been updated successfully.',
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update environment',
        description: handleSupabaseError(error, 'An unexpected error occurred while updating the environment.'),
        variant: 'destructive',
      });
    },
  });

  const deleteEnvironmentMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Environment ID is required');
      
      const { error } = await supabase
        .from('environments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: 'Environment deleted',
        description: 'The environment has been deleted successfully.',
      });
      navigate('/settings/environments');
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete environment',
        description: handleSupabaseError(error, 'An unexpected error occurred while deleting the environment.'),
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!editedEnvironment.name || !editedEnvironment.cluster_url) {
      toast({
        title: 'Required fields missing',
        description: 'Please provide a name and cluster URL for the environment.',
        variant: 'destructive',
      });
      return;
    }

    updateEnvironmentMutation.mutate();
  };

  const handleDelete = () => {
    deleteEnvironmentMutation.mutate();
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

  const renderEnvironmentDetails = () => {
    if (!environment) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              {environment.name} {getStatusBadge(environment.status)}
            </h1>
            <p className="text-muted-foreground">{environment.description || 'No description provided.'}</p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateEnvironmentMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the environment "{environment.name}".
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">
              <Server className="mr-2 h-4 w-4" />
              Environment Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Environment</CardTitle>
                  <CardDescription>
                    Update your environment details and configuration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Environment Name</Label>
                    <Input
                      id="name"
                      value={editedEnvironment.name}
                      onChange={(e) => setEditedEnvironment({ 
                        ...editedEnvironment, 
                        name: e.target.value 
                      })}
                      placeholder="Production"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedEnvironment.description}
                      onChange={(e) => setEditedEnvironment({ 
                        ...editedEnvironment, 
                        description: e.target.value 
                      })}
                      placeholder="Production Kubernetes cluster"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editedEnvironment.status}
                      onValueChange={(value) => setEditedEnvironment({ 
                        ...editedEnvironment, 
                        status: value 
                      })}
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
                      value={editedEnvironment.cluster_url}
                      onChange={(e) => setEditedEnvironment({ 
                        ...editedEnvironment, 
                        cluster_url: e.target.value 
                      })}
                      placeholder="https://k8s.example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="credential_type">Credential Type</Label>
                    <Select
                      value={editedEnvironment.credential_type}
                      onValueChange={(value) => setEditedEnvironment({ 
                        ...editedEnvironment, 
                        credential_type: value 
                      })}
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
                  
                  {(editedEnvironment.credential_type === 'token' || editedEnvironment.credential_type === 'both') && (
                    <div className="grid gap-2">
                      <Label htmlFor="credential_token">Access Token</Label>
                      <Input
                        id="credential_token"
                        type="password"
                        value={editedEnvironment.credential_token}
                        onChange={(e) => setEditedEnvironment({ 
                          ...editedEnvironment, 
                          credential_token: e.target.value 
                        })}
                        placeholder="kubeconfig token"
                      />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to keep the current token.
                      </p>
                    </div>
                  )}
                  
                  {(editedEnvironment.credential_type === 'certificate' || editedEnvironment.credential_type === 'both') && (
                    <div className="grid gap-2">
                      <Label htmlFor="credential_certificate">Certificate</Label>
                      <Textarea
                        id="credential_certificate"
                        value={editedEnvironment.credential_certificate}
                        onChange={(e) => setEditedEnvironment({ 
                          ...editedEnvironment, 
                          credential_certificate: e.target.value 
                        })}
                        placeholder="Certificate content"
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to keep the current certificate.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Environment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                        <p className="text-lg">{environment.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <p className="text-lg">{getStatusBadge(environment.status)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p className="text-lg">{environment.description || 'No description provided.'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cluster Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-y-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Cluster URL</h3>
                        <p className="text-lg font-mono">{environment.cluster_url}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Credential Type</h3>
                        <p className="text-lg capitalize">{environment.credential_type}</p>
                      </div>
                      {(environment.credential_type === 'token' || environment.credential_type === 'both') && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Access Token</h3>
                          <p className="text-lg">
                            {environment.credential_token ? '••••••••••••••••' : 'Not set'}
                          </p>
                        </div>
                      )}
                      {(environment.credential_type === 'certificate' || environment.credential_type === 'both') && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Certificate</h3>
                          <p className="text-lg">
                            {environment.credential_certificate ? '••••••••••••••••' : 'Not set'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Audit Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-4 w-4" /> Created
                        </h3>
                        <p className="text-lg">{formatRelative(new Date(environment.created_at), new Date())}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-4 w-4" /> Last Updated
                        </h3>
                        <p className="text-lg">{formatRelative(new Date(environment.updated_at), new Date())}</p>
                      </div>
                      {environment.created_by && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                            <User className="mr-1 h-4 w-4" /> Created By
                          </h3>
                          <p className="text-lg">{environment.created_by}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <DetailPageLayout
      isLoading={isLoading}
      resource={environment}
      resourceType="Environment"
      onGoBack={() => navigate('/settings/environments')}
      renderResource={renderEnvironmentDetails}
    />
  );
}
