
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';

export interface AuthState {
  session: {
    user: User | null;
    isLoading: boolean;
  };
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

export interface AuthContextType {
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
