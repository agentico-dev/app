
import { supabase } from '@/integrations/supabase/client';
import { Organization } from '@/types/organization';

/**
 * Access a table in the api schema
 * @param table The table name (without the schema prefix)
 * @returns A PostgrestQueryBuilder for the specified table
 */
export const apiTable = (table: string) => {
  return supabase.from(`api.${table}`);
};

/**
 * Create a relationship query string for tables in the api schema
 * @param table The related table name
 * @param fields The fields to select from the related table
 * @returns A properly formatted select string for use in join queries
 */
export const apiJoin = (table: string, fields: string) => {
  return `api.${table}(${fields})`;
};

/**
 * Handles Supabase errors consistently
 * @param error The error object from Supabase
 * @returns A standardized error message
 */
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  if (error?.message) {
    return error.message;
  }
  if (error?.error_description) {
    return error.error_description;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Get the global organization that all users belong to
 * @returns Promise with the global organization
 */
export const getGlobalOrganization = async (): Promise<Organization | null> => {
  try {
    const { data, error } = await apiTable('organizations')
      .select('*')
      .eq('slug', 'global')
      .single();
    
    if (error) {
      console.error('Error fetching global organization:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Ensure the response matches the Organization type
    const organization: Organization = {
      id: data.id,
      name: data.name,
      slug: data.slug || '',
      description: data.description || '',
      logo_url: data.logo_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_global: true
    };
    
    return organization;
  } catch (error) {
    console.error('Error fetching global organization:', error);
    return null;
  }
};
