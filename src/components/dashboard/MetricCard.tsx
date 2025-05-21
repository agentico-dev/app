
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean | null;
}

export function MetricCard({ title, value, description, icon: Icon, trend, trendUp }: MetricCardProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card to-background/80 backdrop-blur-sm border-opacity-40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-sm">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <Link to={`/${title.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-green-500/70 bg-clip-text text-transparent">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs ${
              trendUp === true ? 'text-green-500' :
              trendUp === false ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {trendUp === true && <ArrowUpRight className="h-3 w-3" />}
              {trendUp === false && <ArrowDownRight className="h-3 w-3" />}
              {trendUp === null && <Minus className="h-3 w-3" />}
              <span>{trend}</span>
            </div>
          )}
        </Link>
      </CardContent>
    </Card>
  );
}
