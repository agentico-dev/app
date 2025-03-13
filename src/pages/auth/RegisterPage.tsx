import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PlanSelector } from '@/components/PlanSelector';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Available plans
const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic features for personal use',
    price: {
      amount: 0,
      currency: 'USD',
      frequency: 'monthly'
    },
    features: ['5 applications', 'Basic analytics', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced features for professionals',
    price: {
      amount: 15,
      currency: 'USD',
      frequency: 'monthly'
    },
    features: ['Unlimited applications', 'Advanced analytics', 'Priority support', 'Custom domains'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete solution for teams',
    price: {
      amount: 49,
      currency: 'USD',
      frequency: 'monthly'
    },
    features: ['Unlimited everything', 'Team collaboration', 'Dedicated support', 'Custom integrations', 'SLA'],
  },
];

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export default function RegisterPage() {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Register the user with Supabase Auth
      await signUp(values.email, values.password, values.fullName, selectedPlan);
      
      // Get the newly created user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Create an organization for the new user
        const orgName = `${values.fullName}'s Organization`;
        const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: orgName,
            slug: orgSlug,
            description: `Personal organization for ${values.fullName}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (orgError) throw orgError;
        
        // Add the user as an owner of the organization
        if (org) {
          const { error: memberError } = await supabase
            .from('organization_members')
            .insert({
              organization_id: org.id,
              user_id: user.id,
              role: 'Owner',
              created_at: new Date().toISOString()
            });
          
          if (memberError) throw memberError;
        }
      }
      
      // Navigate to login page
      navigate('/login', { 
        state: { message: 'Registration successful! Please sign in.' } 
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container relative flex h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900/80" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/favicon-32x32.png" alt="Agentico" className="h-6 w-6" />
            <span>Agentico</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The best way to predict the future is to invent it.&rdquo;
            </p>
            <footer className="text-sm">
              - Alan Kay
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-10 sm:max-w-lg lg:row-span-2 lg:w-[480px] bg-background">
        <div className="flex flex-col items-center justify-center text-center space-y-2 sm:w-[350px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Create an account
            </CardTitle>
            <CardDescription>
              Start building amazing things today.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
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
                        <Input placeholder="name@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PlanSelector plans={plans} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            Already have an account? <Link to="/login" className="underline underline-offset-4 ml-1 hover:text-primary">Sign in</Link>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
