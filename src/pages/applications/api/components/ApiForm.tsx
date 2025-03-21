
import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { useNavigate } from 'react-router';
import { FormTabs } from './form-tabs';
import { ApiFormDetails } from './form-details';
import ApiServicesList from './ApiServicesList';
import ApiMessagesList from './ApiMessagesList';
import { ApiFormValues } from '@/hooks/application-apis/useApiForm';

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
  
  // Function to handle tab change
  const handleTabChange = (value: string) => {
    if (setActiveTab) {
      setActiveTab(value);
    }
  };
  
  // Determine if we should show the services and messages tabs
  const hasSourceContent = form.watch('source_content') ? true : false;

  const handleCancel = () => {
    navigate(`/applications/${applicationId}/apis`);
  };

  return (
    <div>
      <FormTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isNew={isNew} 
        hasSourceContent={hasSourceContent}
      >
        <TabsContent value="details">
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
      </FormTabs>
    </div>
  );
}
