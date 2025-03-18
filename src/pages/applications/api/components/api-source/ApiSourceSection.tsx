
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

  // Validate URI when it changes
  React.useEffect(() => {
    if (sourceType === 'uri') {
      const currentUri = form.getValues('source_uri');
      setIsUriValid(isValidUri(currentUri));
    }
  }, [form.watch('source_uri'), sourceType]);

  // Handle source type changes
  function handleSourceTypeChange(value: 'uri' | 'content') {
    setSourceType(value);
  }
  
  function isUriMode() {
    const uriValue = form.getValues('source_uri');
    return uriValue && !uriValue.startsWith('urn:') ? true : false;
  }
  
  function isContentMode() {
    const isContent = form.getValues('source_content') && form.getValues('source_content').length > 0 ? true : false;
    const uriValue = form.getValues('source_uri');
    if (isContent && (!uriValue || !uriValue.startsWith('urn:'))) {
      generateURN(form, apiSlug, organizationSlug, applicationSlug, apiVersion);
    }
    return isContent;
  }

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
          isUriMode={isUriMode()}
          isContentMode={isContentMode()}
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
