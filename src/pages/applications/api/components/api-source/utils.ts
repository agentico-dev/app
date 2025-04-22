
import { UseFormReturn } from 'react-hook-form';
import { ApplicationAPI } from '@/types/application';

/**
 * Generates a standardized URN for API content
 */
export function generateURN(
  form: UseFormReturn<Partial<ApplicationAPI> & { fetchContent?: boolean; }>, 
  apiSlug: string, 
  organizationSlug: string, 
  applicationSlug: string, 
  apiVersion: string
) {
  const name = form.getValues('name') || '';
  // Use apiSlug if provided, otherwise generate from name
  const slug = apiSlug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  // Generate the URN
  const urn = `urn:agentico:apis:${organizationSlug}:${applicationSlug || 'app'}:${slug}:${apiVersion}`;
  console.log('Generated URN:', urn);
  // Set the URN as source_uri
  form.setValue('source_uri', urn);
}
