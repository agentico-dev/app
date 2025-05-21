
/**
 * Attempts to parse a string as JSON
 * @param content String to parse
 * @returns Parsed object if successful, or null if parsing fails
 */
export function try_parse(content: string): any | null {
  if (!content || typeof content !== 'string') return null;
  
  // Try JSON
  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

/**
 * Formats JSON content with consistent indentation
 * @param jsonContent JSON string to format
 * @returns Formatted JSON string or original string if parsing fails
 */
export function formatJson(jsonContent: string): string {
  try {
    const parsed = JSON.parse(jsonContent);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return jsonContent;
  }
}

/**
 * Detects if content is valid JSON
 * @param content String to check
 * @returns True if valid JSON, false otherwise
 */
export function isValidJson(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validates if a string is a valid email format
 * @param email String to check
 * @returns True if valid email format, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
