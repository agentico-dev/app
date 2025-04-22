
import React from 'react';
import { Button } from '@/components/ui/button';
import { NodeType } from '@/types/workflow';
import { LucideIcon } from 'lucide-react';

interface NodeTypeButtonProps {
  type: NodeType;
  label: string;
  icon: LucideIcon;
  color: string;
  onClick: (type: NodeType, label: string) => void;
}

export function NodeTypeButton({ type, label, icon: Icon, color, onClick }: NodeTypeButtonProps) {
  return (
    <Button
      variant="outline"
      className={`flex items-center gap-1 h-8 ${color} border`}
      onClick={() => onClick(type, label)}
    >
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}
