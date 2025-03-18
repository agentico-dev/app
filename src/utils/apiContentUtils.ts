/**
 * Converts a base64 string to a Uint8Array
 * @param base64 The base64 string to convert
 * @returns The Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('Error converting base64 to Uint8Array:', error);
    throw new Error('Failed to convert base64 to binary data');
  }
}

/**
 * Converts a Uint8Array to a base64 string
 * @param uint8Array The Uint8Array to convert
 * @returns The base64 string
 */
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  try {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('Error converting Uint8Array to base64:', error);
    throw new Error('Failed to convert binary data to base64');
  }
}

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

export const compressContent = (content: string): Uint8Array => {
  // In a real app, this would use compression like gzip
  // For now, we'll just convert to a Uint8Array
  const encoder = new TextEncoder();
  return encoder.encode(content);
};

export const decompressContent = (compressed: string): string => {
  // In a real app, this would use decompression
  // For now, we'll just decode the base64 string to text
  try {
    const binary = base64ToUint8Array(compressed);
    const decoder = new TextDecoder();
    return decoder.decode(binary);
  } catch (e) {
    console.error('Error decompressing content:', e);
    return '';
  }
};
