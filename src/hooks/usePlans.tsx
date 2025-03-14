import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Plan } from '@/types/plans';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export function usePlans() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const isAuthenticated = !!session.user;

  // Fetch all available plans
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price');
      
      if (error) throw error;
      return data as Plan[];
    },
  });

  // Get current user's plan
  const { data: currentPlan } = useQuery({
    queryKey: ['currentPlan', session.user?.id],
    queryFn: async () => {
      if (!session.user) return null;
      
      // Get user's profile with plan_id
      const { data, error } = await supabase
        .from('profiles')
        .select('plan_id')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      
      if (!data?.plan_id) return null;
      
      // Get the plan details
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', data.plan_id)
        .single();
      
      if (planError) throw planError;
      
      return planData as Plan;
    },
    enabled: isAuthenticated,
  });

  // Update user's plan
  const updatePlan = useMutation({
    mutationFn: async (planId: string) => {
      if (!session.user) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan_id: planId,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      // Get the updated plan details to return
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (planError) throw planError;
      
      return planData as Plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPlan'] });
      toast({
        title: 'Plan updated',
        description: 'Your subscription plan has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating plan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Cancel subscription
  const cancelSubscription = useMutation({
    mutationFn: async () => {
      if (!session.user) throw new Error('Authentication required');
      
      // Set plan_id to null or to a free plan id as appropriate
      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan_id: null, // Or use your free plan ID
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);
      
      if (error) throw error;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentPlan'] });
      toast({
        title: 'Subscription canceled',
        description: 'Your subscription has been canceled successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error canceling subscription',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    plans,
    currentPlan,
    isLoading,
    error,
    isAuthenticated,
    updatePlan,
    cancelSubscription,
  };
}
