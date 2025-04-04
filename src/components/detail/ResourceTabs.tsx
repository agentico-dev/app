
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router';

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  description?: string;
  reference?: string | null;
  icon?: ReactNode;
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
              {tab.description && (
                <div className="flex items-center space-x-2">
                  <CardDescription>{tab.description}</CardDescription>
                  {tab.reference && (
                    <Link 
                      to={`${tab.reference}`}
                      className="text-blue-500 hover:underline"
                    >
                      {tab.icon}
                    </Link>
                  )}
                </div>
              )}
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
