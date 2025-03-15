
/**
 * Utilities for handling API content - compression, decompression, and fetching
 */
import { toast } from 'sonner';
import pako from 'pako';

/**
 * Convert a string to a compressed Uint8Array
 */
export const compressContent = (content: string): Uint8Array => {
  try {
    const data = new TextEncoder().encode(content);
    return pako.deflate(data);
  } catch (error) {
    console.error('Error compressing content:', error);
    throw new Error('Failed to compress content');
  }
};

/**
 * Convert a compressed Uint8Array back to a string
 */
export const decompressContent = (compressedData: Uint8Array): string => {
  try {
    const decompressed = pako.inflate(compressedData);
    return new TextDecoder().decode(decompressed);
  } catch (error) {
    console.error('Error decompressing content:', error);
    throw new Error('Failed to decompress content');
  }
};

/**
 * Convert base64 string to Uint8Array
 */
export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes;
};

/**
 * Convert Uint8Array to base64 string
 */
export const uint8ArrayToBase64 = (array: Uint8Array): string => {
  let binary = '';
  const len = array.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(array[i]);
  }
  
  return btoa(binary);
};

/**
 * Determine if a string is JSON
 */
export const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Fetch content from a URI
 */
export const fetchContentFromUri = async (uri: string): Promise<{ content: string, format: 'json' | 'yaml' }> => {
  try {
    const response = await fetch(uri);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from URI: ${response.statusText}`);
    }
    
    const content = await response.text();
    const format = isJsonString(content) ? 'json' : 'yaml';
    
    return { content, format };
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};
