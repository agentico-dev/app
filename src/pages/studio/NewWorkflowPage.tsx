
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewWorkflowPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const aiGenerated = searchParams.get('aiGenerated') === 'true';
  const prompt = searchParams.get('prompt') || '';
  
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(aiGenerated);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // If this is AI-generated, simulate AI generating a name and description
    if (aiGenerated && prompt) {
      const timer = setTimeout(() => {
        // In a real app, this would come from an AI service
        const generatedName = prompt
          .split(' ')
          .slice(0, 3)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') + ' Workflow';
        
        setWorkflowName(generatedName);
        setWorkflowDescription(prompt);
        setIsGenerating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [aiGenerated, prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workflowName.trim()) {
      toast.error('Workflow name is required');
      return;
    }
    
    setIsCreating(true);
    
    // Simulate workflow creation
    setTimeout(() => {
      const newWorkflowId = Date.now().toString();
      toast.success('Workflow created successfully');
      navigate(`/studio/workflows/${newWorkflowId}`);
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/studio');
  };

  if (isGenerating) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Generating Your Workflow</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            We're using AI to create a workflow based on your prompt:<br /> 
            <span className="font-medium italic">"{prompt}"</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Studio
        </Button>
      </div>
      
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Create New Workflow</CardTitle>
          <CardDescription>
            {aiGenerated
              ? 'We\'ve generated this workflow based on your prompt. You can edit the details before creating it.'
              : 'Set up a new workflow to organize your AI workflows.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Describe what this workflow will do"
                rows={4}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Workflow
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
