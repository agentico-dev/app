
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { apiTable } from '@/utils/supabaseHelpers';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

interface AuthContextType {
  session: {
    user: User | null;
    isLoading: boolean;
  };
  user: User | null;
  profile: Profile | null;
  signIn: (provider: string, email?: string, password?: string) => Promise<{ error: any; data: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

interface Profile {
  id: string;
  full_name: string | null;
  plan_id: string | null;
  created_at: string;
  updated_at: string;
  bio?: string | null;
  job_title?: string | null;
  company?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: session?.user ? true : false,
      }));
      
      if (session?.user.id) {
        loadUserProfile(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: session?.user ? true : false,
      }));
      
      if (session?.user.id) {
        loadUserProfile(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, profile: null, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await apiTable('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error loading user profile:', error);
        setAuthState(prev => ({
          ...prev,
          profile: null,
          loading: false,
        }));
      } else if (data) {
        const userProfile: Profile = {
          id: data.id,
          full_name: data.full_name,
          plan_id: data.plan_id,
          created_at: data.created_at,
          updated_at: data.updated_at,
          bio: data.bio,
          job_title: data.job_title,
          company: data.company
        };
        setAuthState(prev => ({
          ...prev,
          profile: userProfile,
          loading: false,
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          profile: null,
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setAuthState(prev => ({
        ...prev,
        profile: null,
        loading: false,
      }));
    }
  };

  const signIn = async (provider: string, email?: string, password?: string) => {
    if (provider === 'email' && email && password) {
      return supabase.auth.signInWithPassword({ email, password });
    } else if (provider === 'github') {
      return supabase.auth.signInWithOAuth({ provider: 'github' });
    } else if (provider === 'google') {
      return supabase.auth.signInWithOAuth({ provider: 'google' });
    }
    return { data: null, error: new Error('Invalid auth provider or credentials') };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    return supabase.auth.signUp({ 
      email, 
      password,
      options: { data: metadata }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthState(prev => ({
      ...prev, 
      profile: null
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        session: {
          user: authState.user,
          isLoading: authState.loading,
        },
        user: authState.user,
        profile: authState.profile,
        signIn,
        signUp,
        signOut,
        loading: authState.loading,
        isAuthenticated: !!authState.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
