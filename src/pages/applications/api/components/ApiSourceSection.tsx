
import * as React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationAPI } from '@/types/application';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  // Add state for URI validation
  const [isUriValid, setIsUriValid] = React.useState(true);

  // Generate URN when source type changes to 'content'
  React.useEffect(() => {
    if (sourceType === 'content' && !form.getValues('source_content')) {
      // If switching to content mode but no content yet, don't generate URN
      return;
    }
  }, [sourceType, form, applicationSlug, organizationSlug, apiVersion, apiSlug]);

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

  function generateURN(form: UseFormReturn<Partial<ApplicationAPI> & { fetchContent?: boolean; }>, apiSlug: string, organizationSlug: string, applicationSlug: string, apiVersion: string) {
    const name = form.getValues('name') || '';
    // Use apiSlug if provided, otherwise generate from name
    const slug = apiSlug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    // Generate the URN
    const urn = `urn:agentico:apis:${organizationSlug}:${applicationSlug || 'app'}:${slug}:${apiVersion}`;
    console.log('Generated URN:', urn);
    // Set the URN as source_uri
    form.setValue('source_uri', urn);
  }
  
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="source_uri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source URI</FormLabel>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip open={sourceType === 'uri' && !isUriValid}>
                      <TooltipTrigger asChild>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/api-spec.json" 
                            {...field} 
                            readOnly={isContentMode()}
                            className={!isUriValid ? "border-red-500 focus-visible:ring-red-500" : ""}
                          />
                        </FormControl>
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500 text-white">
                        <p>Please enter a valid URL (https://example.com/spec.json)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {onFetchContent && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onFetchContent}
                      title="Fetch and load content from URI"
                      disabled={!isUriValid}
                    >
                      <Download className="h-4 w-4 mr-2" /> Fetch
                    </Button>
                  )}
                </div>
                <FormDescription>
                  Link to the API specification file (OpenAPI, Swagger, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {setShouldFetchContent && (
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="fetch-on-save" 
                checked={shouldFetchContent}
                onCheckedChange={(checked) => setShouldFetchContent(checked as boolean)}
              />
              <label 
                htmlFor="fetch-on-save" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Fetch content from URI when saving
              </label>
            </div>
          )}

          <FormField
            control={form.control}
            name="source_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Content</FormLabel>
                {!field.value && isUriMode() && (
                  <Alert className="mb-3 bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      The content is empty. Click the "Fetch" button above to load content from the URI, or check "Fetch content from URI when saving".
                    </AlertDescription>
                  </Alert>
                )}
                <FormControl>
                  <CodeEditor 
                    value={field.value || ''} 
                    onChange={field.onChange}
                    language={codeLanguage}
                    className="min-h-[300px]"
                    readOnly={isUriMode()}
                  />
                </FormControl>
                <FormDescription>
                  API specification content (read-only in URI mode)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="source_uri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Generated URI</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-muted" />
                </FormControl>
                <FormDescription>
                  Agentico URN for this API specification (auto-generated)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center space-x-2">
            <FormLabel>Format</FormLabel>
            <Select 
              value={codeLanguage} 
              onValueChange={(value) => setCodeLanguage(value as 'json' | 'yaml')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <FormField
            control={form.control}
            name="source_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Content</FormLabel>
                <FormControl>
                  <CodeEditor 
                    value={field.value || ''} 
                    onChange={field.onChange}
                    language={codeLanguage}
                    className="min-h-[300px]"
                  />
                </FormControl>
                <FormDescription>
                  Paste or write your API specification (OpenAPI, Swagger, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};
