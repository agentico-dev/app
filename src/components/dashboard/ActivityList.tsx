
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ActivityData {
  icon: React.ElementType;
  description: string;
  time: string;
}

interface ActivityListProps {
  activities: ActivityData[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <Card className="h-full bg-gradient-to-br from-card to-background/80 backdrop-blur-sm border-opacity-40 shadow-lg">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions in your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? activities.map((activity, index) => (
            <motion.div 
              key={index} 
              className="flex items-start gap-4 p-2 hover:bg-background/50 rounded-md transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <div className="mt-0.5 h-8 w-8 rounded-full bg-gradient-to-br from-secondary/30 to-background flex items-center justify-center shadow-sm">
                <activity.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          )) : (
            <p className="text-center py-8 text-muted-foreground">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
