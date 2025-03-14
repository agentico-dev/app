import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiTable } from '@/utils/supabaseHelpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, CheckCircle, KeyRound, LogOut, Save, Trash2, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import PlanSelector from '@/components/PlanSelector';
import { usePlans } from '@/hooks/usePlans';

export default function ProfilePage() {
  const { user, profile, signOut, loading } = useAuth();
  const { toast } = useToast();
  const { plans, activePlan, changePlan, cancelSubscription } = usePlans();
  
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [currentTab, setCurrentTab] = useState('profile');

  if (loading) {
    return (
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Loading profile...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Available</CardTitle>
            <CardDescription>
              You need to be logged in to view your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setJobTitle(profile.job_title || '');
      setCompany(profile.company || '');
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const { error } = await apiTable('profiles')
        .update({
          full_name: fullName,
          bio: bio,
          job_title: jobTitle,
          company: company,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setSuccessMessage('Profile updated successfully');
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast({
        title: "Error updating profile",
        description: err.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePlanChange = async (planId: string) => {
    try {
      await changePlan(planId);
      toast({
        title: "Plan updated",
        description: "Your subscription plan has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating plan",
        description: error.message || "Failed to update your plan.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <Tabs defaultValue={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="plan">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and public profile.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert variant="default" className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                      <AvatarFallback className="text-lg">
                        {fullName ? fullName.charAt(0).toUpperCase() : <User />}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us a bit about yourself"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="Your position or role"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company">Company / Organization</Label>
                        <Input
                          id="company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Where you work"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (profile) {
                      setFullName(profile.full_name || '');
                      setBio(profile.bio || '');
                      setJobTitle(profile.job_title || '');
                      setCompany(profile.company || '');
                    }
                    setError('');
                    setSuccessMessage('');
                  }}
                >
                  Reset
                </Button>
                <Button onClick={handleUpdateProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Password</h3>
                  <p className="text-muted-foreground">Change your account password.</p>
                  <Button variant="outline" className="mt-2">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Logout</h3>
                  <p className="text-muted-foreground">Sign out of your account.</p>
                  <Button variant="outline" className="mt-2" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <p className="text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Input
                      placeholder="Type 'delete' to confirm"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button
                      variant="destructive"
                      disabled={deleteConfirm !== 'delete'}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plan">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    During the beta period, all plans are free. Choose the plan that best suits your needs.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Plan: <span className="text-primary capitalize">{activePlan?.name || 'Free'}</span></h3>
                  <p className="text-muted-foreground">Select a plan to change your subscription:</p>
                  
                  <PlanSelector
                    plans={plans}
                    selectedPlan={profile?.plan_id || 'free'}
                    onSelectPlan={handlePlanChange}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-destructive">Cancel Subscription</h3>
                  <p className="text-muted-foreground">
                    Cancel your subscription and downgrade to the Free plan.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={cancelSubscription}
                    disabled={profile?.plan_id === 'free' || !profile?.plan_id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
