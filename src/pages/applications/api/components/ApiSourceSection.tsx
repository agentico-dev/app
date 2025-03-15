
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationAPI } from '@/types/application';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface ApiSourceSectionProps {
  form: UseFormReturn<Partial<ApplicationAPI> & { fetchContent?: boolean }>;
  sourceType: 'uri' | 'content';
  setSourceType: (type: 'uri' | 'content') => void;
  codeLanguage: 'json' | 'yaml';
  setCodeLanguage: (language: 'json' | 'yaml') => void;
  onFetchContent?: () => void;
  shouldFetchContent?: boolean;
  setShouldFetchContent?: (value: boolean) => void;
}

export const ApiSourceSection: React.FC<ApiSourceSectionProps> = ({
  form,
  sourceType,
  setSourceType,
  codeLanguage,
  setCodeLanguage,
  onFetchContent,
  shouldFetchContent,
  setShouldFetchContent
}) => {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">API Source</h3>
      
      <RadioGroup 
        value={sourceType} 
        onValueChange={(value) => setSourceType(value as 'uri' | 'content')}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="uri" id="source-uri" />
          <FormLabel htmlFor="source-uri" className="cursor-pointer">External Source URI</FormLabel>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="content" id="source-content" />
          <FormLabel htmlFor="source-content" className="cursor-pointer">Inline Source Content</FormLabel>
        </div>
      </RadioGroup>
      
      {sourceType === 'uri' ? (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="source_uri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source URI</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="https://example.com/api-spec.json" {...field} />
                  </FormControl>
                  {onFetchContent && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onFetchContent}
                      title="Fetch and load content from URI"
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
        </div>
      ) : (
        <div className="space-y-3">
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
