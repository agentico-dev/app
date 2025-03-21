
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TagsSelector from '@/components/applications/TagSelector';
import { Save, ArrowLeft } from 'lucide-react';
import { ApiSourceSection } from '../api-source';
import { ApiFormValues } from '@/hooks/application-apis/useApiForm';

interface ApiFormDetailsProps {
  form: UseFormReturn<ApiFormValues>;
  isSubmitting: boolean;
  isNew: boolean;
  sourceType: 'uri' | 'content';
  setSourceType: (type: 'uri' | 'content') => void;
  codeLanguage: 'json' | 'yaml';
  setCodeLanguage: (lang: 'json' | 'yaml') => void;
  onFetchContent?: () => void;
  shouldFetchContent?: boolean;
  setShouldFetchContent?: (value: boolean) => void;
  applicationSlug?: string;
  organizationSlug?: string;
  apiVersion?: string;
  apiSlug?: string;
  onCancel: () => void;
}

export function ApiFormDetails({
  form,
  isSubmitting,
  isNew,
  sourceType,
  setSourceType,
  codeLanguage,
  setCodeLanguage,
  onFetchContent,
  shouldFetchContent,
  setShouldFetchContent,
  applicationSlug,
  organizationSlug,
  apiVersion,
  apiSlug,
  onCancel
}: ApiFormDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter API name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Version</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 1.0, v2, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the purpose and functionality of this API"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Status</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="inactive" />
                  <Label htmlFor="inactive">Inactive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deprecated" id="deprecated" />
                  <Label htmlFor="deprecated">Deprecated</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="archived" id="archived" />
                  <Label htmlFor="archived">Archived</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <TagsSelector
                selectedTags={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <ApiSourceSection
          form={form}
          sourceType={sourceType}
          setSourceType={setSourceType}
          codeLanguage={codeLanguage}
          setCodeLanguage={setCodeLanguage}
          onFetchContent={onFetchContent}
          shouldFetchContent={shouldFetchContent}
          setShouldFetchContent={setShouldFetchContent}
          applicationSlug={applicationSlug}
          organizationSlug={organizationSlug}
          apiVersion={apiVersion}
          apiSlug={apiSlug}
        />
      </div>
      
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : isNew ? 'Create API' : 'Update API'}
        </Button>
      </div>
    </div>
  );
}
