
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertCircle, Github, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PlanSelector from '@/components/PlanSelector';
import { supabase } from '@/integrations/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('free');
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError(null);
    setRegistering(true);
    
    try {
      // Sign up the user with Supabase Auth with metadata
      const metadata = { 
        full_name: fullName, 
        plan_id: selectedPlanId 
      };
      
      await signUp(email, password, metadata);
      
      // Wait for auth state to be updated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (user) {
        // Create a personal organization for the user
        const orgName = `${fullName}'s Organization`;
        const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        const { data: org, error: orgError } = await supabase
          .rpc('create_organization', {
            org_name: orgName,
            org_slug: orgSlug,
            org_description: `Personal organization for ${fullName}`,
            org_logo_url: null
          })
          .select()
          .single();
        
        if (orgError) throw orgError;
        
        // Add the user as an owner of the organization
        const { error: memberError } = await supabase
          .rpc('add_organization_member', {
            org_id: org.id,
            member_id: user.id,
            member_role: 'owner'
          });
        
        if (memberError) throw memberError;
      }
      
      toast.success('Account created! Please log in.', {
        description: 'Your account has been created successfully.',
      });
      
      // Redirect to login
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
      toast.error('Registration failed', {
        description: err.message || 'Please try again.',
      });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <div className="space-y-3">
              <Label>Choose a Plan</Label>
              <PlanSelector
                selectedPlan={selectedPlanId}
                onSelectPlan={setSelectedPlanId}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={registering}>
              {registering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
          
          <Separator />
          
          <Button variant="outline" className="w-full" disabled={registering}>
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
