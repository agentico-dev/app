
import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash } from 'lucide-react';

const EnvironmentsPage = () => {
  const navigate = useNavigate();
  
  // This is a placeholder - in a real app you would fetch environments from your API
  const environments = [
    { id: '1', name: 'Development', key: 'dev', isDefault: true },
    { id: '2', name: 'Staging', key: 'staging', isDefault: false },
    { id: '3', name: 'Production', key: 'prod', isDefault: false },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Environments</h1>
          <p className="text-muted-foreground">
            Manage your application environments and their configurations.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Environment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {environments.map((env) => (
          <Card key={env.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{env.name}</CardTitle>
                {env.isDefault && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    Default
                  </Badge>
                )}
              </div>
              <CardDescription>Environment Key: {env.key}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Configure variables, secrets, and settings for your {env.name.toLowerCase()} environment.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => navigate(`/settings/environments/${env.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentsPage;
