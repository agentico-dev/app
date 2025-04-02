
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProjectServers } from '@/hooks/useProjectServers';
import { ServersTable } from '../ServersTable';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CreateServerForm } from '../CreateServerForm';

interface ServersTabProps {
  projectId: string;
}

export function ServersTab({ projectId }: ServersTabProps) {
  const navigate = useNavigate();
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Servers</h3>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsAddServerOpen(true)} 
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Insert
          </Button>
          <Button 
            onClick={() => setIsImportOpen(true)} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            Import from CSV
          </Button>
        </div>
      </div>

      {/* Display servers in a table */}
      <ServersTable
        servers={associatedServers?.map(item => item.server) || []}
        isLoading={isLoadingAssociatedServers}
        projectId={projectId}
      />

      {/* Add Server Sheet */}
      <Sheet open={isAddServerOpen} onOpenChange={setIsAddServerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-5">
            <SheetTitle>Add Server to Project</SheetTitle>
            <SheetDescription>
              Create a new server and automatically associate it with this project.
            </SheetDescription>
          </SheetHeader>
          <CreateServerForm 
            projectId={projectId} 
            onSuccess={() => setIsAddServerOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Import CSV Sheet - Placeholder for now */}
      <Sheet open={isImportOpen} onOpenChange={setIsImportOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Import Servers from CSV</SheetTitle>
            <SheetDescription>
              Upload a CSV file to import multiple servers at once.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <p className="text-muted-foreground">
              CSV import functionality is not yet implemented. Please check back later.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
