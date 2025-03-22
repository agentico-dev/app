import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationAPI } from '@/types/application';
import { UriSourceSection } from './UriSourceSection';
import { generateURN } from './utils';

interface ApiSourceSectionProps {
  form: UseFormReturn<Partial<ApplicationAPI> & { fetchContent?: boolean }>;
  sourceType: 'uri' | 'content' | undefined;
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
  const [isContentMode, setIsContentMode] = React.useState(false);

  // Function to validate URI
  function isValidUri(uri: string): boolean {
    try {
      new URL(uri);
      return true;
    } catch (e) {
      // Allow URNs (they're valid internally) - but urn must follow the accepted format
      // NOT empty parts (RFC 1035): urn:agentico:apis:[ORG]:[APP]:[SLUG]:[VERSION]
      const urnRegex = /^urn:agentico:apis:[a-zA-Z0-9\-]+:[a-zA-Z0-9\-]+:[a-zA-Z0-9\-]+:[a-zA-Z0-9\-]+$/;
      // Check if the URI is a valid URN
      return urnRegex.test(uri);// || uri.startsWith('urn:');
    }
  }

  // Watch form values
  const sourceUri = form.watch('source_uri');
  const sourceContent = form.watch('source_content');
  const apiName = form.watch('name');
  const apiVersionFromForm = form.watch('version');

  // Check URI and source modes when values change
  React.useEffect(() => {
    // Check URI validity
    setIsUriValid(isValidUri(sourceUri));

    // Check if we're in content mode
    const newIsContentMode = sourceContent?.length > 0 ? true : false;
    setIsContentMode(newIsContentMode);
  }, [sourceUri, sourceContent]);

  React.useEffect(() => {
    console.log('Updated Source mode:', {
      isContentMode,
      sourceUri,
      sourceContent,
      sourceType
    });
  }, [isContentMode, sourceUri, sourceContent, sourceType]);

  // Generate URN when in content mode and content exists
  React.useEffect(() => {
    // Only generate URN when in content mode, content exists, and either no URI exists or it's not already a URN
    if (isContentMode &&
      sourceContent.length > 0 &&
      (!sourceUri || !sourceUri.startsWith('urn:'))) {

      // Get the current version from form or use default
      const currentVersion = apiVersionFromForm || apiVersion;

      // Generate the URN
      generateURN(form, apiSlug, organizationSlug, applicationSlug, currentVersion);

      console.log('Generated URN based on content change');
    }
  }, [
    sourceType,
    sourceContent,
    apiName, // Also regenerate if name changes (since it impacts the URN)
    apiVersionFromForm, // Also regenerate if version changes
    sourceUri,
    apiSlug,
    organizationSlug,
    applicationSlug,
    apiVersion,
    form // Include form in dependencies for consistency
  ]);

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">API Source</h3>
      <UriSourceSection
        form={form}
        isUriValid={isUriValid}
        onFetchContent={onFetchContent}
        shouldFetchContent={shouldFetchContent}
        setShouldFetchContent={setShouldFetchContent}
        isContentMode={isContentMode}
        codeLanguage={codeLanguage}
        sourceUri={sourceUri}
      />
    </div>
  );
};
