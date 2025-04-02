
import { useNavigate } from 'react-router';
import { useProjectServers } from '@/hooks/useProjectServers';
import { ServersTable } from '../ServersTable';

interface ServersTabProps {
  projectId: string;
}

export function ServersTab({ projectId }: ServersTabProps) {
  const navigate = useNavigate();
  const {
    associatedServers,
    isLoadingAssociatedServers,
  } = useProjectServers(projectId);
  
  if (isLoadingAssociatedServers) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Display servers in a table
  return (
    <ServersTable
      servers={associatedServers?.map(item => item.server) || []}
      isLoading={isLoadingAssociatedServers}
    />
  );
}
