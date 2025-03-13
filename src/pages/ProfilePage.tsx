
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, User, Key, CreditCard, Mail, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  bio: z.string().optional(),
  job_title: z.string().optional(),
  company: z.string().optional(),
});

export default function ProfilePage() {
  const { session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      // Only proceed if user is authenticated
      if (!session.user) {
        return null;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching profile data:', error);
        return null;
      }
    },
    enabled: !!session.user,
  });

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      bio: '',
      job_title: '',
      company: '',
    },
    values: profileData && session.user ? {
      full_name: profileData.full_name || '',
      email: session.user.email || '',
      bio: profileData.bio || '',
      job_title: profileData.job_title || '',
      company: profileData.company || '',
    } : undefined,
  });

  const updateProfile = useMutation({
    mutationFn: async (values: z.infer<typeof profileFormSchema>) => {
      if (!session.user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          bio: values.bio,
          job_title: values.job_title,
          company: values.company,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    updateProfile.mutate(values);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (isLoading || !profileData) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const userInitials = profileData.full_name
    ? profileData.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session.user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account">
            <Shield className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security">
            <Key className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={profileData.full_name || ''} />
                  <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input disabled {...field} />
                            <Button type="button" variant="ghost" className="ml-2">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your email address is managed through your account settings.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about yourself" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="job_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Your job title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Account Type</h3>
                <p className="text-muted-foreground">
                  Your account is on the {profileData.plan_id || 'Free'} plan
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Connected Accounts</h3>
                <p className="text-muted-foreground">
                  No connected accounts
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <Button variant="outline">Connect Google</Button>
                  <Button variant="outline">Connect GitHub</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <label htmlFor="current-password">Current Password</label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="new-password">New Password</label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="w-full">Change Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your billing information and subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Current Plan</h3>
                <p className="text-muted-foreground">
                  You are on the {profileData.plan_id || 'Free'} plan
                </p>
                <Button variant="outline">Upgrade Plan</Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <p className="text-muted-foreground">
                  No payment method added
                </p>
                <Button variant="outline">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
