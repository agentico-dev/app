import yaml from 'js-yaml';

/**
 * Attempts to parse a string as JSON or YAML
 * @param content String to parse
 * @returns Parsed object if successful, or null if parsing fails
 */
export function try_parse(content: string): any | null {
  if (!content || typeof content !== 'string') return null;
  
  // First try JSON
  try {
    return JSON.parse(content);
  } catch (e) {
    // If JSON fails, try YAML
    try {
      return yaml.load(content);
    } catch (e) {
      return null;
    }
  }
}

/**
 * Converts between JSON and YAML formats
 * @param content The content to convert
 * @param targetFormat The target format ('json' or 'yaml')
 * @returns Converted string or null if conversion fails
 */
export function convertFormat(content: string, targetFormat: 'json' | 'yaml'): string | null {
  const parsed = try_parse(content);
  if (!parsed) return null;
  
  try {
    if (targetFormat === 'json') {
      return JSON.stringify(parsed, null, 2);
    } else {
      return yaml.dump(parsed, { indent: 2 });
    }
  } catch (e) {
    return null;
  }
}
