import { compress, decompress } from 'lz-string';

/**
 * Compresses a string using lz-string
 * @param content The string to compress
 * @returns The compressed string
 */
export function compressContent(content: string): Uint8Array {
  const compressed = compress(content);
  const uint8Array = new Uint8Array(compressed.length);
  for (let i = 0; i < compressed.length; i++) {
    uint8Array[i] = compressed.charCodeAt(i);
  }
  return uint8Array;
}

/**
 * Decompresses a string using lz-string
 * @param compressedContent The compressed string
 * @returns The decompressed string
 */
export function decompressContent(compressedContent: Uint8Array): string {
  let compressed = '';
  for (let i = 0; i < compressedContent.length; i++) {
    compressed += String.fromCharCode(compressedContent[i]);
  }
  return decompress(compressed) || '';
}

/**
 * Converts a base64 string to a Uint8Array
 * @param base64 The base64 string to convert
 * @returns The Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts a Uint8Array to a base64 string
 * @param uint8Array The Uint8Array to convert
 * @returns The base64 string
 */
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

/**
 * Fetches API content from a URI and attempts to determine the format
 * @param uri The URI to fetch the content from
 * @returns The content and format (json or yaml)
 */
export async function fetchContentFromUri(uri: string): Promise<{ content: string, format: 'json' | 'yaml' }> {
  console.log('Fetching content from URI:', uri);
  
  try {
    const response = await fetch(uri, {
      headers: {
        'Accept': 'application/json, application/yaml, text/yaml, text/plain',
      },
    });

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
