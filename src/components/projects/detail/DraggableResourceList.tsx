
import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Application } from '@/types/application';
import { AITool } from '@/types/ai-tool';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ResourceContainerProps {
  id: string;
  title: string;
  items: Application[] | AITool[];
  resourceType: 'application' | 'tool';
  emptyMessage: string;
  emptyIcon: React.ReactNode;
  createButtonLabel?: string;
  onCreateClick?: () => void;
}

interface DraggableResourceListProps {
  projectId: string;
  availableResources: Application[] | AITool[];
  associatedResources: Application[] | AITool[];
  resourceType: 'application' | 'tool';
  onResourceMoved: (resourceId: string, source: string, destination: string) => Promise<void>;
  createButtonLabel?: string;
  onCreateClick?: () => void;
  showEmptyState?: boolean;
  emptyStateMessage?: string;
}

// A component to render each column (Available or Associated)
const ResourceContainer = ({ 
  id, 
  title, 
  items, 
  resourceType, 
  emptyMessage, 
  emptyIcon,
  createButtonLabel,
  onCreateClick 
}: ResourceContainerProps) => (
  <Card className="flex-1 min-h-[400px] max-h-[600px] overflow-hidden flex flex-col">
    <CardHeader className="pb-0">
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <Droppable droppableId={id}>
      {(provided) => (
        <CardContent 
          className="flex-1 overflow-y-auto p-4" 
          ref={provided.innerRef} 
          {...provided.droppableProps}
        >
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="transition-all duration-200"
                    >
                      {resourceType === 'application' ? (
                        <ApplicationCard application={item as Application} />
                      ) : (
                        <Card className="p-4">
                          <h3 className="font-medium">{(item as AITool).name}</h3>
                          <p className="text-sm text-muted-foreground">{(item as AITool).description}</p>
                        </Card>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              {emptyIcon}
              <h3 className="text-lg font-medium mt-4 mb-2">
                {emptyMessage}
              </h3>
              {createButtonLabel && onCreateClick && (
                <Button onClick={onCreateClick} className="mt-4">
                  {createButtonLabel}
                </Button>
              )}
            </div>
          )}
          {provided.placeholder}
        </CardContent>
      )}
    </Droppable>
  </Card>
);

// An empty state component for when no resources are available
const EmptyResourceState = ({ 
  message, 
  resourceType, 
  createButtonLabel, 
  onCreateClick 
}: { 
  message: string; 
  resourceType: string; 
  createButtonLabel?: string; 
  onCreateClick?: () => void; 
}) => (
  <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg bg-muted/10">
    {resourceType === 'application' 
      ? <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </div>
      : <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M18 16H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z"/><path d="m10 10-2-2m0 0L6 6m2 2 2-2m4 2 2-2m0 0 2-2m-2 2-2-2"/></svg>
        </div>
    }
    <h3 className="text-lg font-medium mt-4 mb-2">{message}</h3>
    {createButtonLabel && onCreateClick && (
      <Button onClick={onCreateClick} className="mt-4">
        {createButtonLabel}
      </Button>
    )}
  </div>
);

export function DraggableResourceList({ 
  projectId,
  availableResources, 
  associatedResources, 
  resourceType,
  onResourceMoved,
  createButtonLabel,
  onCreateClick,
  showEmptyState = false,
  emptyStateMessage
}: DraggableResourceListProps) {
  const [localAvailable, setLocalAvailable] = React.useState<Application[] | AITool[]>([]);
  const [localAssociated, setLocalAssociated] = React.useState<Application[] | AITool[]>([]);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Initialize local state from props
  React.useEffect(() => {
    setLocalAvailable(availableResources);
    setLocalAssociated(associatedResources);
  }, [availableResources, associatedResources]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a valid droppable area
    if (!destination) return;
    
    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Type assertions for TypeScript
    const sourceItems = source.droppableId === 'available' 
      ? [...localAvailable] as (Application | AITool)[]
      : [...localAssociated] as (Application | AITool)[];
    
    const destItems = destination.droppableId === 'available' 
      ? [...localAvailable] as (Application | AITool)[]
      : [...localAssociated] as (Application | AITool)[];
    
    // Find the item being moved
    const itemToMove = sourceItems.find(item => item.id === draggableId);
    if (!itemToMove) return;
    
    // Remove from source
    const newSourceItems = sourceItems.filter(item => item.id !== draggableId);
    
    // Add to destination
    const newDestItems = [...destItems];
    newDestItems.splice(destination.index, 0, itemToMove);
    
    // Update local state immediately for responsive UI
    if (source.droppableId === 'available') {
      setLocalAvailable(newSourceItems as Application[] | AITool[]);
    } else {
      setLocalAssociated(newSourceItems as Application[] | AITool[]);
    }
    
    if (destination.droppableId === 'available') {
      setLocalAvailable(newDestItems as Application[] | AITool[]);
    } else {
      setLocalAssociated(newDestItems as Application[] | AITool[]);
    }
    
    // Handle association or disassociation
    setIsUpdating(true);
    try {
      await onResourceMoved(draggableId, source.droppableId, destination.droppableId);
      
      // Show success message
      if (source.droppableId === 'available' && destination.droppableId === 'associated') {
        toast.success(`${resourceType === 'application' ? 'Application' : 'AI Tool'} associated with project`);
      } else if (source.droppableId === 'associated' && destination.droppableId === 'available') {
        toast.success(`${resourceType === 'application' ? 'Application' : 'AI Tool'} removed from project`);
      }
    } catch (error) {
      console.error('Error moving resource:', error);
      toast.error(`Failed to update ${resourceType} association`);
      
      // Revert local state on error
      setLocalAvailable(availableResources);
      setLocalAssociated(associatedResources);
    } finally {
      setIsUpdating(false);
    }
  };

  // If we need to show an empty state (for tools with no associated applications)
  if (showEmptyState) {
    return (
      <EmptyResourceState 
        message={emptyStateMessage || `No ${resourceType === 'application' ? 'applications' : 'AI tools'} available`} 
        resourceType={resourceType}
        createButtonLabel={createButtonLabel}
        onCreateClick={onCreateClick}
      />
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-6">
        <ResourceContainer
          id="available"
          title="Available"
          items={localAvailable}
          resourceType={resourceType}
          emptyMessage={`No available ${resourceType === 'application' ? 'applications' : 'AI tools'}`}
          emptyIcon={resourceType === 'application' 
            ? <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </div>
            : <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M18 16H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z"/><path d="m10 10-2-2m0 0L6 6m2 2 2-2m4 2 2-2m0 0 2-2m-2 2-2-2"/></svg>
              </div>
          }
          createButtonLabel={createButtonLabel}
          onCreateClick={onCreateClick}
        />
        
        <ResourceContainer
          id="associated"
          title={`Associated with Project`}
          items={localAssociated}
          resourceType={resourceType}
          emptyMessage={`No ${resourceType === 'application' ? 'applications' : 'AI tools'} associated with this project`}
          emptyIcon={resourceType === 'application' 
            ? <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </div>
            : <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M18 16H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z"/><path d="m10 10-2-2m0 0L6 6m2 2 2-2m4 2 2-2m0 0 2-2m-2 2-2-2"/></svg>
              </div>
          }
        />
      </div>
    </DragDropContext>
  );
}
