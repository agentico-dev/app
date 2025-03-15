
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ApplicationAPI } from '@/types/application';
import { ApiSourceSection } from './ApiSourceSection';
import { useNavigate } from 'react-router-dom';

interface ApiFormProps {
  form: UseFormReturn<Partial<ApplicationAPI>>;
  onSubmit: (data: Partial<ApplicationAPI>) => Promise<void>;
  isSubmitting: boolean;
  isNew: boolean;
  applicationId: string;
  sourceType: 'uri' | 'content';
  setSourceType: (type: 'uri' | 'content') => void;
  codeLanguage: 'json' | 'yaml';
  setCodeLanguage: (language: 'json' | 'yaml') => void;
}

export const ApiForm: React.FC<ApiFormProps> = ({
  form,
  onSubmit,
  isSubmitting,
  isNew,
  applicationId,
  sourceType,
  setSourceType,
  codeLanguage,
  setCodeLanguage
}) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter API name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your API"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide a brief description of what this API does.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value} // Important for persistence
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The current status of this API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1.0.0" {...field} />
              </FormControl>
              <FormDescription>
                The version of this API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Source Configuration - Using the ApiSourceSection component */}
      <ApiSourceSection 
        form={form}
        sourceType={sourceType}
        setSourceType={setSourceType}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
      />
      
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter tags separated by commas"
                value={field.value?.join(', ') || ''}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean);
                  field.onChange(tags);
                }}
              />
            </FormControl>
            <FormDescription>
              Tags help categorize and find your APIs.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/applications/${applicationId}`)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isNew
              ? 'Creating...'
              : 'Updating...'
            : isNew
            ? 'Create API'
            : 'Update API'}
        </Button>
      </div>
    </form>
  );
};
