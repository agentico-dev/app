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

/**
 * Helper function to check if a user has access to a project
 * 
 * @param projectId The ID of the project to check
 * @returns Promise resolving to a boolean indicating whether the user has access
 */
export async function hasProjectAccess(projectId: string): Promise<boolean> {
  if (!projectId) return false;
  
  try {
    // First check if the project exists and is either public or belongs to the global organization
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('is_public, organization_id')
      .eq('id', projectId)
      .single();
    
    if (projectError || !project) return false;
    
    // If the project is public, allow access
    if (project.is_public) return true;
    
    // Check if the global organization exists and if the project belongs to it
    const globalOrg = await getGlobalOrganization();
    if (globalOrg && project.organization_id === globalOrg.id) return true;
    
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    // Check if the user is a member of the project's organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', project.organization_id)
      .eq('user_id', session.user.id)
      .single();
    
    return !membershipError && !!membership;
  } catch (error) {
    console.error('Error checking project access:', error);
    return false;
  }
}

/**
 * Helper function to check if a user has access to a server
 * 
 * @param serverId The ID of the server to check
 * @returns Promise resolving to a boolean indicating whether the user has access
 */
export async function hasServerAccess(serverId: string): Promise<boolean> {
  if (!serverId) return false;
  
  try {
    // First check if the server exists and is either public or belongs to the global organization
    const { data: server, error: serverError } = await supabase
      .from('servers')
      .select('is_public, organization_id')
      .eq('id', serverId)
      .single();
    
    if (serverError || !server) return false;
    
    // If the server is public, allow access
    if (server.is_public) return true;
    
    // Check if the global organization exists and if the server belongs to it
    const globalOrg = await getGlobalOrganization();
    if (globalOrg && server.organization_id === globalOrg.id) return true;
    
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    // Check if the user is a member of the server's organization
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', server.organization_id)
      .eq('user_id', session.user.id)
      .single();
    
    return !membershipError && !!membership;
  } catch (error) {
    console.error('Error checking server access:', error);
    return false;
  }
}

/**
 * Helper function to handle errors from Supabase operations
 * @param error The error object from a Supabase operation
 * @param fallbackMessage A fallback message if the error doesn't have a message
 * @returns A user-friendly error message
 */
export function handleSupabaseError(error: any, fallbackMessage = "An unknown error occurred"): string {
  if (!error) return fallbackMessage;
  
  // Log the full error for debugging
  console.error("Supabase error:", error);
  
  // Return a user-friendly message
  return error.message || error.error_description || fallbackMessage;
}
