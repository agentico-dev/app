
import * as React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationAPI } from '@/types/application';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContentSourceSectionProps {
  form: UseFormReturn<Partial<ApplicationAPI> & { fetchContent?: boolean }>;
  codeLanguage: 'json' | 'yaml';
  setCodeLanguage: (language: 'json' | 'yaml') => void;
}

export const ContentSourceSection: React.FC<ContentSourceSectionProps> = ({
  form,
  codeLanguage,
  setCodeLanguage
}) => {
  const [isGeneratedURI, setIsGeneratedURI] = React.useState(false);
  // Validate URI when it changes
  React.useEffect(() => {
    form.getValues('source_uri')?.startsWith('urn:') ? setIsGeneratedURI(true) : setIsGeneratedURI(false);    
  }, [form.watch('source_uri')]);
  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="source_uri"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>{isGeneratedURI ? 'Generated URI' : 'External URI'}</FormLabel>
              <FormControl>
                <Input {...field} readOnly={isGeneratedURI} className={isGeneratedURI ? 'bg-muted' : ''} />
              </FormControl>
              <FormDescription>
                {isGeneratedURI ? 'Agentico URN for this API specification (auto-generated)' : 'External URI for this API specification'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
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
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Source Content</FormLabel>
              <FormControl>
                <CodeEditor 
                  value={field.value || ''} 
                  onChange={field.onChange}
                  language={codeLanguage}
                  className="min-h-[300px]"
                  readOnly={!isGeneratedURI}
                />
              </FormControl>
              <FormDescription>
                { isGeneratedURI ? 'Paste or write your API specification (OpenAPI, Swagger, gRPC, etc.)' : 'Fetched API specification'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
