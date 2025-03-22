
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ApiFormDetails } from './form-details';
import ApiServicesList from './ApiServicesList';
import ApiMessagesList from './ApiMessagesList';
import { ApiFormValues } from '@/hooks/application-apis/useApiForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ApiFormProps {
  form: UseFormReturn<ApiFormValues>;
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
  const navigate = useNavigate();
  
  // Determine if we should show the services and messages tabs
  const hasSourceContent = form.watch('source_content') ? true : false;

  const handleCancel = () => {
    navigate(`/applications/${applicationId}/apis`);
  };

  // For new APIs, just show the form details
  if (isNew) {
    return (
      <div>
        <ApiFormDetails
          form={form}
          isSubmitting={isSubmitting}
          isNew={isNew}
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
          onCancel={handleCancel}
        />
      </div>
    );
  }

  // For existing APIs, show the tabs
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab ? setActiveTab : () => {}}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">API Details</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <ApiFormDetails
            form={form}
            isSubmitting={isSubmitting}
            isNew={isNew}
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
            onCancel={handleCancel}
          />
        </TabsContent>
        
        <TabsContent value="services" className="pt-4">
          <ApiServicesList apiId={apiId} applicationId={applicationId} />
        </TabsContent>
        
        <TabsContent value="messages" className="pt-4">
          <ApiMessagesList apiId={apiId} applicationId={applicationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
