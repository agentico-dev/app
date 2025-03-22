
import React from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useApplications } from '@/hooks';
import { useOrganizations } from '@/hooks/useOrganizations';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ApiForm } from './components/ApiForm';
import { ApiFormStatus } from './components/ApiFormStatus';
import { useApiForm } from '@/hooks/application-apis/useApiForm';

export function ApiFormController() {
  const { applicationId, apiId } = useParams<{ applicationId: string; apiId: string }>();
  
  // Get application data
  const { applications, isLoading: isAppLoading } = useApplications();
  const application = applications?.find(app => app.id === applicationId);
  
  // Get organization data
  const { organizations, isLoading: isOrgLoading } = useOrganizations();
  
  // Add a null check before using find on organizations array
  const organization = organizations?.find(org => 
    application?.organization_id ? org.id === application.organization_id : false
  );
  
  // Use our new hook for API form handling
  const {
    form,
    isEditMode,
    isSubmitting,
    isApiLoading,
    apiError,
    sourceType,
    setSourceType,
    codeLanguage,
    setCodeLanguage,
    handleFetchContent,
    shouldFetchContent,
    setShouldFetchContent,
    initialValues,
    onSubmit
  } = useApiForm({ applicationId, apiId });

  // The combined loading state includes both applications and organizations
  const isLoading = isAppLoading || isOrgLoading;

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit API' : 'Create API'}</CardTitle>
          <CardDescription>
            {isEditMode ? 'Edit the API details below.' : 'Create a new API for your application.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiFormStatus 
            isLoading={isLoading || isApiLoading}
            error={apiError}
            applicationMissing={!application}
          />
          
          {application && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ApiForm
                  form={form}
                  isSubmitting={isSubmitting}
                  isNew={!isEditMode}
                  applicationId={applicationId || ''}
                  sourceType={sourceType}
                  setSourceType={setSourceType}
                  codeLanguage={codeLanguage}
                  setCodeLanguage={setCodeLanguage}
                  onFetchContent={handleFetchContent}
                  shouldFetchContent={shouldFetchContent}
                  setShouldFetchContent={setShouldFetchContent}
                  applicationSlug={application?.slug}
                  organizationSlug={organization?.slug}
                  apiVersion={form.watch('version')}
                  apiSlug={initialValues?.slug}
                  apiId={apiId}
                />
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}

export default ApiFormController;
