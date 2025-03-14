
import { supabase } from '@/integrations/supabase/client';

// Helper functions for working with Supabase and the api schema

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
