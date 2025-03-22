
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useNavigate } from 'react-router';
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
  
  // Determine if we should show the services and messages tabs
  const hasSourceContent = form.watch('source_content') ? true : false;

  const handleCancel = () => {
    navigate(`/applications/${applicationId}`);
  };

  // For existing APIs with content, we'll show services and messages in the future
  // but for now we just show the form details
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
      
      {/* We'll add these tabs back when they're needed
      {!isNew && hasSourceContent && (
        <>
          <ApiServicesList apiId={apiId} applicationId={applicationId} />
          <ApiMessagesList apiId={apiId} applicationId={applicationId} />
        </>
      )} */}
    </div>
  );
}
