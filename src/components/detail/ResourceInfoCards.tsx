
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

export interface InfoCardItem {
  icon: ReactNode;
  label: string;
  value: string | number | ReactNode;
}

interface ResourceInfoCardProps {
  title: string;
  items: InfoCardItem[];
}

export function ResourceInfoCard({ title, items }: ResourceInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ResourceInfoCardsProps {
  cards: {
    title: string;
    items: InfoCardItem[];
  }[];
}

export function ResourceInfoCards({ cards }: ResourceInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <ResourceInfoCard key={index} title={card.title} items={card.items} />
      ))}
    </div>
  );
}
