
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationAPI } from '@/types/application';

interface ApiSourceSectionProps {
  form: UseFormReturn<Partial<ApplicationAPI>>;
  sourceType: 'uri' | 'content';
  setSourceType: (type: 'uri' | 'content') => void;
  codeLanguage: 'json' | 'yaml';
  setCodeLanguage: (language: 'json' | 'yaml') => void;
}

export const ApiSourceSection: React.FC<ApiSourceSectionProps> = ({
  form,
  sourceType,
  setSourceType,
  codeLanguage,
  setCodeLanguage,
}) => {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">API Source</h3>
      
      <RadioGroup 
        defaultValue={sourceType} 
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
        <FormField
          control={form.control}
          name="source_uri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source URI</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/api-spec.json" {...field} />
              </FormControl>
              <FormDescription>
                Link to the API specification file (OpenAPI, Swagger, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
