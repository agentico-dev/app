
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { apiTable } from '@/utils/supabaseHelpers';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const location = useLocation();
  const { user, profile, loading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      full_name: profile?.full_name || user?.user_metadata?.full_name || '',
      job_title: profile?.job_title || '',
      company: profile?.company || '',
      bio: profile?.bio || '',
    }
  });

  const onSubmit = async (data) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      // Update user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: data.full_name }
      });
      
      if (authError) throw authError;
      
      // Update profile in profiles table
      const { error: profileError } = await apiTable('profiles')
        .upsert({
          id: user.id,
          full_name: data.full_name,
          job_title: data.job_title,
          company: data.company,
          bio: data.bio,
          updated_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Check if we're on a nested route
  const isNestedRoute = location.pathname !== '/profile' && location.pathname !== '/settings';
  
  if (isNestedRoute) {
    return <Outlet />;
  }
  
  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading profile...</div>;
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Profile Not Available</CardTitle>
          <CardDescription>You need to be logged in to view your profile.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const userInitials = (profile?.full_name || user.user_metadata?.full_name || user.email || '')
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="profile" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{profile?.full_name || user.user_metadata?.full_name || user.email}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input 
                        id="full_name" 
                        {...register('full_name')} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job_title">Job Title</Label>
                      <Input 
                        id="job_title" 
                        {...register('job_title')} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      {...register('company')} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input 
                      id="bio" 
                      {...register('bio')} 
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your password to improve account security.
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Delete your account and all associated data.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Outlet />
    </div>
  );
};

export default ProfilePage;
