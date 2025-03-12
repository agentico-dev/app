
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateServerForm from '@/components/forms/CreateServerForm';

export default function NewServerPage() {
  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/servers">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Servers
        </Link>
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Server</h1>
        <p className="text-muted-foreground">
          Set up a new server for your AI applications
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Server Details</CardTitle>
          <CardDescription>
            Fill in the details to create your new server
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateServerForm />
        </CardContent>
      </Card>
    </div>
  );
}
