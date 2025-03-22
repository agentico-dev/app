
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationAPI } from '@/types/application';
import { UriSourceSection } from './UriSourceSection';
import { ContentSourceSection } from './ContentSourceSection';
import { generateURN } from './utils';

interface ApiSourceSectionProps {
  form: UseFormReturn<Partial<ApplicationAPI> & { fetchContent?: boolean }>;
  sourceType: 'uri' | 'content';
  setSourceType: (type: 'uri' | 'content') => void;
  codeLanguage: 'json' | 'yaml';
  setCodeLanguage: (language: 'json' | 'yaml') => void;
  onFetchContent?: () => void;
  shouldFetchContent?: boolean;
  setShouldFetchContent?: (value: boolean) => void;
  applicationSlug?: string;
  organizationSlug?: string;
  apiVersion?: string;
  apiSlug?: string;
}

export const ApiSourceSection: React.FC<ApiSourceSectionProps> = ({
  form,
  sourceType,
  setSourceType,
  codeLanguage,
  setCodeLanguage,
  onFetchContent,
  shouldFetchContent,
  setShouldFetchContent,
  applicationSlug,
  organizationSlug = 'global',
  apiVersion = '1.0.0',
  apiSlug
}) => {
  const [isUriValid, setIsUriValid] = React.useState(true);
  const [isUriMode, setIsUriMode] = React.useState(false);
  const [isContentMode, setIsContentMode] = React.useState(false);

  // Function to validate URI
  function isValidUri(uri: string): boolean {
    if (!uri) return true; // Empty URI is considered valid (not filled yet)
    try {
      new URL(uri);
      return true;
    } catch (e) {
      // Allow URNs (they're valid internally)
      return uri.startsWith('urn:');
    }
  }

  // Watch for relevant changes to determine when to generate URN
  const sourceUri = form.watch('source_uri');
  const sourceContent = form.watch('source_content');
  const apiName = form.watch('name');

  // Check URI and source modes when values change
  React.useEffect(() => {
    // Check URI validity
    setIsUriValid(isValidUri(sourceUri));
    
    // Check if we're in URI mode
    const newIsUriMode = sourceUri && !sourceUri.startsWith('urn:') ? true : false;
    setIsUriMode(newIsUriMode);
    
    // Check if we're in content mode
    const newIsContentMode = sourceContent && sourceContent.length > 0 ? true : false;
    setIsContentMode(newIsContentMode);
  }, [sourceUri, sourceContent]);

  // Generate URN when in content mode and content exists
  React.useEffect(() => {
    // Only generate URN when in content mode, content exists, and either no URI exists or it's not already a URN
    if (sourceType === 'content' && 
        sourceContent && 
        sourceContent.length > 0 && 
        (!sourceUri || !sourceUri.startsWith('urn:'))) {
      
      // Get the current version from form or use default
      const currentVersion = form.watch('version') || apiVersion;
      
      // Generate the URN
      generateURN(form, apiSlug, organizationSlug, applicationSlug, currentVersion);
      
      console.log('Generated URN based on content change');
    }
  }, [
    sourceType, 
    sourceContent, 
    apiName, // Also regenerate if name changes (since it impacts the URN)
    form.watch('version'), // Also regenerate if version changes
    sourceUri,
    apiSlug, 
    organizationSlug, 
    applicationSlug, 
    apiVersion
  ]);

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">API Source</h3>
      
      {sourceType === 'uri' ? (
        <UriSourceSection 
          form={form}
          isUriValid={isUriValid}
          onFetchContent={onFetchContent}
          shouldFetchContent={shouldFetchContent}
          setShouldFetchContent={setShouldFetchContent}
          isUriMode={isUriMode}
          isContentMode={isContentMode}
          codeLanguage={codeLanguage}
        />
      ) : (
        <ContentSourceSection 
          form={form}
          codeLanguage={codeLanguage}
          setCodeLanguage={setCodeLanguage}
        />
      )}
    </div>
  );
};
