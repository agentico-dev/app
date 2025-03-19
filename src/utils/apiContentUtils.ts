
/**
 * Fetches API content from a URI and attempts to determine the format
 * @param uri The URI to fetch the content from
 * @returns The content and format (json or yaml)
 */
export async function fetchContentFromUri(uri: string): Promise<{ content: string, format: 'json' | 'yaml' }> {
  console.log('Fetching content from URI:', uri);
  
  try {
    let response;
    const headers = {
      'Accept': 'application/json, application/yaml, text/yaml, text/plain',
      'User-Agent': 'Agentico/0.1.0',
    };
    // Check if we need to use a proxy for cross-origin requests
    const useDirectFetch = uri.startsWith(window.location.origin) || uri.startsWith('data:');
    
    if (useDirectFetch) {
      // Direct fetch for same-origin or data URIs
      response = await fetch(uri, { 
        headers,
      });
    } else {
      // For cross-origin requests, you have several options:
      // 1. Use a CORS proxy
      const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(uri)}`;
      // 2. Or use your own backend proxy API if available - @note - uncomment the line below if we provide a backend proxy (in the future?)
      // const corsProxyUrl = `/api/proxy?url=${encodeURIComponent(uri)}`;      
      response = await fetch(corsProxyUrl, {
        headers,
      });
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    
    console.log('Response content type:', contentType);
    console.log('Response content length:', text.length);

    // Determine format based on content type or content inspection
    let format: 'json' | 'yaml' = 'json';
    
    if (contentType.includes('yaml') || contentType.includes('yml')) {
      format = 'yaml';
    } else if (!contentType.includes('json')) {
      // If content type doesn't give us a clue, try to detect from content
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        format = 'json';
      } else if (text.includes(':') && (text.includes('- ') || /^\s*\w+:\s*\w+/m.test(text))) {
        format = 'yaml';
      }
    }

    console.log('Detected format:', format);
    
    return { content: text, format };
  } catch (error) {
    console.error('Error fetching content from URI:', error);
    throw error;
  }
}

// Notification helpers
export const createResourceNotification = async (
  supabase: any,
  params: {
    title: string;
    content: string;
    resourceType: 'project' | 'application' | 'server' | 'tool' | 'api' | 'service';
    resourceId: string;
    relatedResourceId?: string;
    notificationType?: 'info' | 'success' | 'warning' | 'error';
    organizationId?: string;
  }
) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.warn('Cannot create notification: No authenticated user');
      return null;
    }

    const orgId = params.organizationId || localStorage.getItem('selectedOrganizationId');
    if (!orgId) {
      console.warn('Cannot create notification: No organization selected');
      return null;
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: session.session.user.id,
        organization_id: orgId,
        title: params.title,
        content: params.content,
        resource_type: params.resourceType,
        resource_id: params.resourceId,
        related_resource_id: params.relatedResourceId,
        notification_type: params.notificationType || 'info',
        status: 'unread'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createResourceNotification:', error);
    return null;
  }
};
