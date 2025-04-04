
import React from 'react';
import { Application } from '@/types/application';
import { ApplicationCard } from './ApplicationCard';
import { EmptyState } from './EmptyStates';

interface ApplicationsTabContentProps {
  isLoading: boolean;
  error: unknown;
  applications: Application[];
  tabValue: string;
}

export function ApplicationsTabContent({ 
  isLoading, 
  error, 
  applications, 
  tabValue 
}: ApplicationsTabContentProps) {
  // For the "recent" tab, sort by updated_at date
  const displayedApplications = tabValue === 'recent' 
    ? [...applications].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 6)
    : tabValue === 'favorites'
    ? applications.filter(a => a.favorite)
    : applications;

  if (isLoading) {
    return <EmptyState type="loading" />;
  }

  if (error) {
    return <EmptyState type="error" />;
  }

  if (displayedApplications.length === 0) {
    if (tabValue === 'favorites') {
      return <EmptyState type="no-favorites" />;
    }
    return <EmptyState type="no-applications" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayedApplications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}

export default ApplicationsTabContent;
