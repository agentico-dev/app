
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateToolForm from '@/components/forms/CreateToolForm';

export default function NewToolPage() {
  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/ai-tools">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to AI Tools
        </Link>
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New AI Tool</h1>
        <p className="text-muted-foreground">
          Set up a new AI tool for your projects
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Tool Details</CardTitle>
          <CardDescription>
            Fill in the details to create your new AI tool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateToolForm />
        </CardContent>
      </Card>
    </div>
  );
}
