
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateApplicationForm from '@/components/forms/CreateApplicationForm';

export default function NewApplicationPage() {
  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/applications">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applications
        </Link>
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Application</h1>
        <p className="text-muted-foreground">
          Set up a new application in your AI ecosystem
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>
            Fill in the details to create your new application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
