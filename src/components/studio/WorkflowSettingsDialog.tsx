
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Download, Code } from 'lucide-react';

interface WorkflowSettingsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (description: string) => void;
}

export function WorkflowSettingsDialog({
  isOpen,
  setIsOpen,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
}: WorkflowSettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Workflow Settings</DialogTitle>
          <DialogDescription>
            Configure the settings for your workflow.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Workflow Name</label>
            <input
              id="name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Export Options</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="mr-1 h-3 w-3" /> Export JSON
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Code className="mr-1 h-3 w-3" /> Export Code
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="justify-between sm:justify-between">
          <Button type="button" variant="destructive" size="sm">
            <Trash2 className="mr-1 h-3 w-3" /> Delete Workflow
          </Button>
          <Button type="button" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
