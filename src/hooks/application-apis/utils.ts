
import { ApplicationAPI } from '@/types/application';
import { 
  fetchContentFromUri 
} from '@/utils/apiContentUtils';

/**
 * Fetches and compresses content from a URI if needed
 */
export async function fetchContent(
  shouldFetchContent: boolean = false,
  data: Partial<ApplicationAPI>
): Promise<{
  contentToSave: string;
  contentFormat: 'json' | 'yaml';
}> {
  let contentToSave = data.source_content || '';
  let contentFormat = data.content_format || 'json';

  // If fetchContent is true and we have a source_uri, fetch the content
  if (shouldFetchContent && data.source_uri) {
    try {
      const { content, format } = await fetchContentFromUri(data.source_uri);
      contentToSave = content;
      contentFormat = format;
      
      // Log success for debugging
      console.log('Successfully fetched content from URI:', {
        uri: data.source_uri,
        format: format,
        contentLength: content.length
      });
    } catch (error: any) {
      console.error('Failed to fetch content from URI:', error);
      throw new Error(`Failed to fetch content from URI: ${error.message}`);
    }
  }

  return { contentToSave, contentFormat };
}

/**
 * Validates if the source content is present and valid
 */
export function hasValidSourceContent(api?: Partial<ApplicationAPI>): boolean {
  if (!api) return false;
  
  // Check if source_content exists and is not empty
  return !!(api.source_content && api.source_content.trim().length > 0);
}
