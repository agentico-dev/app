import { supabase } from '@/integrations/supabase/client';

// Function to ensure table operations use the correct schema
export const apiTable = (tableName: string) => {
  return supabase.from(tableName);
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

/**
 * Attempts to generate a unique slug by adding a counter to the base slug if needed.
 * 
 * @param name - The string to convert into a slug
 * @param tableName - The table to check for existing slugs
 * @param excludeId - Optional ID to exclude from the uniqueness check (useful for updates)
 * @returns Promise resolving to a unique slug
 */
export async function generateUniqueSlug(
  name: string, 
  tableName: string, 
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(name);
  let counter = 0;
  let newSlug = baseSlug;
  let isUnique = false;
  
  // Keep checking until we find a unique slug
  while (!isUnique) {
    // Generate a new slug with counter if not the first attempt
    if (counter > 0) {
      // Ensure the slug with counter doesn't exceed 63 chars
      const basePrefix = baseSlug.slice(0, 60);
      newSlug = `${basePrefix}-${counter}`;
    }
    
    // Check if the slug already exists
    const query = supabase
      .from(tableName)
      .select('id')
      .eq('slug', newSlug);
      
    // If we're updating an existing record, exclude that record's ID
    if (excludeId) {
      query.neq('id', excludeId);
    }
    
    const { data, error } = await query.limit(1);
    
    if (error) {
      console.error('Error checking slug uniqueness:', error);
      // Return the best guess slug in case of error
      return newSlug;
    }
    
    // If no matching records found, the slug is unique
    if (!data || data.length === 0) {
      isUnique = true;
    } else {
      counter++;
    }
  }
  
  return newSlug;
}

/**
 * Gets the global organization record from the database
 * 
 * @returns Promise resolving to the global organization or null if not found
 */
export async function getGlobalOrganization() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('is_global', true)
    .limit(1)
    .single();
  
  if (error) {
    console.error('Error fetching global organization:', error);
    return null;
  }
  
  return data;
}
