
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PlanSelector from '@/components/PlanSelector';
import { PLAN_DATA } from '@/types/plans';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { session, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    job_title: '',
    company: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Get current plan
  const currentPlan = session.profile?.plan_id 
    ? PLAN_DATA.find((plan) => plan.id === session.profile.plan_id) 
    : PLAN_DATA[0];

  // Handle loading and authentication state
  if (session.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!session.user) {
    navigate('/login');
    return null;
  }

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user?.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          setProfileData({
            full_name: data.full_name || '',
            bio: data.bio || '',
            job_title: data.job_title || '',
            company: data.company || '',
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (session.user) {
      fetchProfile();
    }
  }, [session.user]);

  const handleProfileUpdate = async () => {
    if (!session.user) return;

    setIsUpdating(true);
    try {
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          bio: profileData.bio,
          job_title: profileData.job_title,
          company: profileData.company,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setIsUpdating(true);
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user?.email || '',
        password: passwordData.current_password,
      });

      if (signInError) {
        setPasswordError("Current password is incorrect");
        return;
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });

      if (error) throw error;

      // Clear the form
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      // In a real app, you'd need a secure server-side endpoint to handle this
      // This is a simplified version that only works with RLS properly set up
      const { error } = await supabase.rpc('delete_user_account');
      
      if (error) throw error;

      await signOut();
      navigate('/');
      
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <Button variant="outline" onClick={signOut} className="ml-auto">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={profileData.full_name} 
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={profileData.bio} 
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us a bit about yourself"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job">Job Title</Label>
                  <Input 
                    id="job" 
                    value={profileData.job_title} 
                    onChange={(e) => setProfileData({...profileData, job_title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={profileData.company} 
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update profile'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account credentials and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={session.user?.email} disabled />
                <p className="text-sm text-muted-foreground mt-1">
                  Your email address is used for login and communications.
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="font-medium mb-2">Change Password</h3>
                {passwordError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
              <Button onClick={handlePasswordChange} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Change Password'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>Plan Settings</CardTitle>
              <CardDescription>
                Manage your subscription plan and billing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Current Plan</h3>
                  <div className="p-4 border rounded-md bg-muted/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-lg">{currentPlan?.name}</h4>
                        <p className="text-sm text-muted-foreground">{currentPlan?.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${currentPlan?.price}/month</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="font-medium mb-4">Change Plan</h3>
                  <PlanSelector
                    onSelectPlan={(planId) => toast({
                      title: "Plan selected",
                      description: `You selected the ${PLAN_DATA.find(p => p.id === planId)?.name} plan`,
                    })}
                    selectedPlanId={session.profile?.plan_id}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Cancel Subscription</Button>
              <Button className="ml-auto">Update Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfilePage;
