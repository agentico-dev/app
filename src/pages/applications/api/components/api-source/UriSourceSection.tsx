
import * as React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationAPI } from '@/types/application';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UriSourceSectionProps {
  form: UseFormReturn<Partial<ApplicationAPI> & { fetchContent?: boolean }>;
  isUriValid: boolean;
  onFetchContent?: () => void;
  shouldFetchContent?: boolean;
  setShouldFetchContent?: (value: boolean) => void;
  isContentMode: boolean;
  codeLanguage: 'json' | 'yaml';
  sourceUri?: string;
}

export const UriSourceSection: React.FC<UriSourceSectionProps> = ({
  form,
  isUriValid,
  onFetchContent,
  shouldFetchContent,
  setShouldFetchContent,
  isContentMode,
  codeLanguage,
  sourceUri
}) => {
  const [isGeneratedURI, setIsGeneratedURI] = React.useState(false);

  // Validate URI when it changes
  React.useEffect(() => {
    sourceUri?.length > 0 && sourceUri?.startsWith('urn:') ? setIsGeneratedURI(true) : setIsGeneratedURI(false);
  }, [form.watch('source_uri')]);

  React.useEffect(() => {
    // if content is cleared, set the source_uri to empty
    if (sourceUri?.startsWith('urn:') && !isContentMode) {
      form.setValue('source_uri', '');
    }
  }, [isContentMode]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="source_uri"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source URI</FormLabel>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip open={!isUriValid}>
                  <TooltipTrigger asChild>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/api-spec.json"
                        {...field}
                        readOnly={isContentMode}
                        // If the URI is generated, make it read-only - red border if invalid
                        className={`w-full ${isGeneratedURI ? 'bg-muted' : ''} ${!isUriValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      // className={!isUriValid ? "border-red-500 focus-visible:ring-red-500" : isGeneratedURI ? 'bg-muted' : ''}
                      />
                    </FormControl>
                  </TooltipTrigger>
                  <TooltipContent className="bg-red-500 text-white">
                    <p>Please enter a valid URL (https://example.com/spec.json, urn:agentico:apis:[ORG]:[APP]:[SLUG]:[VERSION])</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {onFetchContent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onFetchContent}
                  title="Fetch and load content from URI"
                  disabled={isContentMode || !isUriValid}
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
            disabled={isContentMode || !isUriValid}
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
            {!field.value && !isContentMode && isUriValid && (
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
                readOnly={!isContentMode && (sourceUri?.length > 0) && !isGeneratedURI}
              />
            </FormControl>
            <FormDescription>
              {/* If content is empty, no URI or URN */}
              {isContentMode || (!(sourceUri?.length > 0) || sourceUri?.startsWith('urn:')) ? 'Paste or write your API specification (OpenAPI, Swagger, gRPC, etc.)' : 'Fetched API specification (read-only)'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
