
import { supabase } from '@/integrations/supabase/client';
import { apiTable, handleSupabaseError } from '@/utils/supabaseHelpers';
import { toast } from 'sonner';
import { Profile } from '@/types/auth';

export const loadUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await apiTable('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine for new users
      console.error('Error loading user profile:', error);
      toast.error(`Error loading profile: ${handleSupabaseError(error)}`);
      return null;
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
      return userProfile;
    } else {
      // No profile found but user exists - this is a valid state for new users
      return null;
    }
  } catch (error) {
    console.error('Failed to load user profile:', error);
    toast.error(`Failed to load profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

export const signInWithProvider = async (provider: string, email?: string, password?: string) => {
  if (provider === 'email' && email && password) {
    return supabase.auth.signInWithPassword({ email, password });
  } else if (provider === 'github') {
    return supabase.auth.signInWithOAuth({ provider: 'github' });
  } else if (provider === 'google') {
    return supabase.auth.signInWithOAuth({ provider: 'google' });
  }
  return { data: null, error: new Error('Invalid auth provider or credentials') };
};

export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  return supabase.auth.signUp({ 
    email, 
    password,
    options: { data: metadata }
  });
};

export const signOutUser = async () => {
  return supabase.auth.signOut();
};
