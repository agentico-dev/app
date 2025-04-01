
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  FileText, 
  Settings, 
  FlaskConical, 
  Share2,
  Upload,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkflowProject } from '@/types/workflow';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

// Mock data for initial display
const mockWorkflows: WorkflowProject[] = [
  {
    id: '1',
    name: 'Customer Support AI',
    description: 'Automate customer support with AI-powered responses',
    workflows: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1',
    is_shared: true,
    team_members: ['2', '3'],
    tags: ['customer-service', 'automation']
  },
  {
    id: '2',
    name: 'Sales Lead Processing',
    description: 'Process new sales leads across CRM systems',
    workflows: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1',
    is_shared: false,
    tags: ['sales', 'crm']
  }
];

export default function StudioPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<WorkflowProject[]>(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const filteredWorkflows = workflows.filter(
    workflow => workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               workflow.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkflow = () => {
    navigate('/studio/new-workflow');
  };

  const handleOpenWorkflow = (workflowId: string) => {
    navigate(`/studio/workflows/${workflowId}`);
  };

  const handleGenerateFromPrompt = () => {
    if (!aiPrompt) {
      toast.error('Please enter a prompt to generate a workflow');
      return;
    }
    
    toast.success('Generating workflow from your prompt...');
    // @todo - In the real implementation, this will call agentico backend to generate a workflow
    // For now, we will just navigate to the new workflow page with the prompt simulating the generation with a delay
    setTimeout(() => {
      navigate('/studio/new-workflow?aiGenerated=true&prompt=' + encodeURIComponent(aiPrompt));
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Studio</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage AI workflow integrations
          </p>
        </div>
        <Button onClick={handleCreateWorkflow}>
          <Plus className="mr-2 h-4 w-4" /> New Workflow
        </Button>
      </div>

      <div className="mb-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border">
        <h2 className="text-lg font-medium mb-2">AI-Assisted Workflow Generation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Describe the workflow you want to create in natural language, and we'll generate it for you.
        </p>
        <div className="flex gap-2">
          <Input 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="E.g., When a new customer signs up, analyze their profile with OpenAI and send a personalized email"
            className="flex-1"
          />
          <Button onClick={handleGenerateFromPrompt}>Generate Workflow</Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Workflows</h2>
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            className="max-w-sm pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredWorkflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
            <FileText className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium">No workflows found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'No workflows match your search query' : 'Create your first workflow to get started'}
          </p>
          <Button onClick={handleCreateWorkflow}>
            <Plus className="mr-2 h-4 w-4" /> Create Workflow
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{workflow.name}</CardTitle>
                <CardDescription className="line-clamp-2">{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    {workflow.workflows.length} workflows
                  </div>
                  {workflow.is_shared && (
                    <div className="ml-4 flex items-center">
                      <Share2 className="mr-1 h-4 w-4" />
                      Shared
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-3 flex justify-between border-t">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-3 w-3" /> Settings
                </Button>
                <Button size="sm" onClick={() => handleOpenWorkflow(workflow.id)}>
                  Open
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
