
import { ApplicationAPI } from '@/types/application';
import { 
  compressContent, 
  decompressContent, 
  base64ToUint8Array, 
  uint8ArrayToBase64, 
  fetchContentFromUri 
} from '@/utils/apiContentUtils';

/**
 * Processes API data from Supabase, handling binary content decompression
 */
export function processApiData(api: any): ApplicationAPI {
  if (api.source_content) {
    try {
      console.log('Processing API content for:', api.name);
      const compressedData = base64ToUint8Array(api.source_content);
      api.source_content = decompressContent(compressedData);
      console.log('Successfully decompressed content:', api.source_content.substring(0, 100) + '...');
    } catch (err) {
      console.error('Error processing API content for:', api.name, err);
      // Try to handle raw content if decompression fails
      try {
        // Attempt to just decode the base64 string directly
        api.source_content = atob(api.source_content);
        console.log('Fallback to direct base64 decode successful');
      } catch (decodeErr) {
        console.error('Fallback decode also failed:', decodeErr);
        api.source_content = ''; // Reset if all decompression fails
      }
    }
  }
  return api as ApplicationAPI;
}

/**
 * Compresses API content for storage in Supabase
 */
export function compressApiContent(content: string | undefined): string | null {
  if (!content) return null;
  
  try {
    return uint8ArrayToBase64(compressContent(content));
  } catch (error) {
    console.error('Error compressing content:', error);
    throw error;
  }
}

/**
 * Fetches and compresses content from a URI if needed
 */
export async function fetchAndCompressContent(
  fetchContent: boolean = false,
  data: Partial<ApplicationAPI>
): Promise<{
  compressedContent: string | null;
  contentToSave: string;
  contentFormat: 'json' | 'yaml';
}> {
  let contentToSave = data.source_content || '';
  let contentFormat = data.content_format || 'json';
  let compressedContent = null;

  // If fetchContent is true and we have a source_uri, fetch the content
  if (fetchContent && data.source_uri) {
    try {
      const { content, format } = await fetchContentFromUri(data.source_uri);
      contentToSave = content;
      contentFormat = format;
    } catch (error: any) {
      console.error('Failed to fetch content from URI:', error);
      throw new Error(`Failed to fetch content from URI: ${error.message}`);
    }
  }

  // Compress the content if it exists
  if (contentToSave) {
    compressedContent = compressApiContent(contentToSave);
  }

  return { compressedContent, contentToSave, contentFormat };
}
