import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState, AuthUser, Profile } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';
import { Provider } from '@supabase/supabase-js';

const AuthContext = createContext<{
  session: AuthState;
  signIn: (provider: Provider | 'email', email?: string, password?: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, planId: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  session: { user: null, profile: null, isLoading: true },
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(prev => ({ ...prev, user: session.user }));
        fetchProfile(session.user.id);
      } else {
        setSession(prev => ({ ...prev, isLoading: false }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSession(prev => ({ ...prev, user: session.user }));
        await fetchProfile(session.user.id);
      } else {
        setSession({ user: null, profile: null, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setSession(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setSession(prev => ({
        ...prev,
        profile: data as Profile,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setSession(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = async (provider: Provider | 'email', email?: string, password?: string) => {
    try {
      if (provider === 'email' && email && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (provider !== 'email') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider as Provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, fullName: string, planId: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Update profile with selected plan
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ plan_id: planId })
          .eq('id', data.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
