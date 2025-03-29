
import React from 'react';
import { Node } from '@xyflow/react';
import { Settings, Trash2, Copy } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';

interface NodeContextMenuProps {
  children: React.ReactNode;
  node: Node;
  onDelete: (nodeId: string) => void;
  onClone: (node: Node) => void;
  onSettings: (node: Node) => void;
}

export function NodeContextMenu({
  children,
  node,
  onDelete,
  onClone,
  onSettings,
}: NodeContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          onClick={() => onSettings(node)}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onClone(node)}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          <span>Clone</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onDelete(node.id)}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
