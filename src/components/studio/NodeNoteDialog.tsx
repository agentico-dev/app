
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NodeNoteDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  nodeId: string | null;
  nodeName: string;
  initialNote: string;
  onSave: (nodeId: string, note: string) => void;
}

export function NodeNoteDialog({
  isOpen,
  setIsOpen,
  nodeId,
  nodeName,
  initialNote,
  onSave,
}: NodeNoteDialogProps) {
  const [note, setNote] = React.useState(initialNote);

  React.useEffect(() => {
    if (isOpen) {
      setNote(initialNote);
    }
  }, [isOpen, initialNote]);

  const handleSave = () => {
    if (nodeId) {
      onSave(nodeId, note);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Node Note: {nodeName}</DialogTitle>
          <DialogDescription>
            Add a descriptive note to explain what this node does in your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what this node does..."
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
