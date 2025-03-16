
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  description?: string;
}

interface ResourceTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export function ResourceTabs({ tabs, defaultTab }: ResourceTabsProps) {
  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.value}>
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{tab.label}</CardTitle>
              {tab.description && <CardDescription>{tab.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              {tab.content}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
