
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthContextType, AuthState } from './types';
import { loadUserProfile, signInWithProvider, signUpWithEmail, signOutUser } from './authUtils';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    session: {
      user: null,
      isLoading: true,
    },
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session: {
          user: session?.user ?? null,
          isLoading: false,
        },
        user: session?.user ?? null,
        loading: session?.user ? true : false,
      }));
      
      if (session?.user.id) {
        loadUserProfileAndUpdateState(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState(prev => ({
        ...prev,
        session: {
          user: session?.user ?? null,
          isLoading: false,
        },
        user: session?.user ?? null,
        loading: session?.user ? true : false,
      }));
      
      if (session?.user?.id) {
        loadUserProfileAndUpdateState(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, profile: null, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfileAndUpdateState = async (userId: string) => {
    const profile = await loadUserProfile(userId);
    setAuthState(prev => ({
      ...prev,
      profile,
      loading: false,
    }));
  };

  const signIn = async (provider: string, email?: string, password?: string) => {
    return signInWithProvider(provider, email, password);
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    return signUpWithEmail(email, password, metadata);
  };

  const signOut = async () => {
    try {
      await signOutUser();
      // Force reset the auth state to avoid stale data
      setAuthState({
        session: {
          user: null,
          isLoading: false,
        },
        user: null,
        profile: null,
        loading: false,
      });
      window.location.href = '/';  // Redirect to home page after logout
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
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
