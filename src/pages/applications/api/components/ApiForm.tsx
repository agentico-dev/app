
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ApplicationAPI } from '@/types/application';
import { ApiSourceSection } from './api-source';
import TagsSelector from '@/components/applications/TagSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Server, MessageSquare } from 'lucide-react';
import ApiServicesList from './ApiServicesList';
import ApiMessagesList from './ApiMessagesList';

interface ApiFormProps {
  form: UseFormReturn<Partial<ApplicationAPI> & { fetchContent?: boolean }>;
  onSubmit: (data: Partial<ApplicationAPI>) => Promise<void>;
  isSubmitting: boolean;
  isNew: boolean;
  applicationId: string;
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
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  apiId?: string;
}

export function ApiForm({
  form,
  onSubmit,
  isSubmitting,
  isNew,
  applicationId,
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
  activeTab = 'details',
  setActiveTab,
  apiId
}: ApiFormProps) {
  // Function to handle tab change
  const handleTabChange = (value: string) => {
    if (setActiveTab) {
      setActiveTab(value);
    }
  };
  
  // Determine if we should show the services and messages tabs
  const hasSourceContent = form.watch('source_content') ? true : false;

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="details">
            <Code className="h-4 w-4 mr-2" /> Details
          </TabsTrigger>
          {!isNew && hasSourceContent && (
            <>
              <TabsTrigger value="services">
                <Server className="h-4 w-4 mr-2" /> Services
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" /> Messages
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="details">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Navigate back to application page without saving
                  window.history.back();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isNew ? 'Create API' : 'Update API'}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        {!isNew && hasSourceContent && (
          <>
            <TabsContent value="services">
              <ApiServicesList apiId={apiId} applicationId={applicationId} />
            </TabsContent>
            
            <TabsContent value="messages">
              <ApiMessagesList apiId={apiId} applicationId={applicationId} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
