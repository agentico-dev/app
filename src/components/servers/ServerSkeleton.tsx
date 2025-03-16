
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ServerSkeletonProps {
  count?: number;
}

export function ServerSkeleton({ count = 6 }: ServerSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="h-24 bg-muted" />
          <CardContent className="py-4">
            <div className="h-5 bg-muted rounded mb-2 w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardContent>
          <CardFooter>
            <div className="h-4 bg-muted rounded w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default ServerSkeleton;
