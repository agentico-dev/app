
import { supabase } from '@/integrations/supabase/client';

// Function to ensure table operations use the correct schema
export const apiTable = (tableName: string) => {
  return supabase.from('public.' + tableName);
};

// Generate a valid slug from a name
export function generateSlug(name: string): string {
  // Convert to lowercase
  let slug = name.toLowerCase();
  
  // Replace spaces and non-alphanumeric characters with dashes
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  
  // Remove leading and trailing dashes
  slug = slug.replace(/^-+|-+$/g, '');
  
  // Ensure it starts with an alphabetic character
  if (!/^[a-z]/.test(slug)) {
    slug = 'a-' + slug;
  }
  
  // Ensure it ends with an alphanumeric character
  if (!/[a-z0-9]$/.test(slug)) {
    slug = slug + '0';
  }
  
  // Limit to 63 characters
  slug = slug.slice(0, 63);
  
  return slug;
}
