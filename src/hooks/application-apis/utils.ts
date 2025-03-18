
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
    } catch (error: any) {
      console.error('Failed to fetch content from URI:', error);
      throw new Error(`Failed to fetch content from URI: ${error.message}`);
    }
  }

  return { contentToSave, contentFormat };
}
