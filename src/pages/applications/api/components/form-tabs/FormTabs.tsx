
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Server, MessageSquare } from 'lucide-react';

interface FormTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isNew: boolean;
  hasSourceContent: boolean;
  children: React.ReactNode;
}

export function FormTabs({
  activeTab,
  onTabChange,
  isNew,
  hasSourceContent,
  children
}: FormTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
        <TabsTrigger value="details">
          <Code className="h-4 w-4 mr-2" /> Details
        </TabsTrigger>
        {!isNew && hasSourceContent && (
          <>
            <TabsTrigger value="services">
              <Server className="h-4 w-4 mr-2" /> Services
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" /> Messages
            </TabsTrigger>
          </>
        )}
      </TabsList>
      {children}
    </Tabs>
  );
}
