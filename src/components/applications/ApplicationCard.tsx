
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AppWindow, CircuitBoard, Star } from 'lucide-react';
import { Application } from '@/types/application';

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const getStatusClassName = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'development': return 'bg-purple-500 hover:bg-purple-600';
      case 'maintenance': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'archived': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{application.name}</CardTitle>
            {application.favorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-2" />
            )}
          </div>
          <CardDescription className="mt-1">
            {application.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {application.category}
          </Badge>
          {application.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <AppWindow className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{application.endpoints_count} endpoints</span>
          </div>
          <div className="flex items-center">
            <CircuitBoard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{application.tools_count} AI tools</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`${getStatusClassName(application.status)} text-white`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
        <Button asChild>
          <Link to={`/applications/${application.id}`}>View API</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ApplicationCard;
