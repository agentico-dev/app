
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
const mockProjects: WorkflowProject[] = [
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
  const [projects, setProjects] = useState<WorkflowProject[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const filteredProjects = projects.filter(
    project => project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    navigate('/studio/new-project');
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/studio/projects/${projectId}`);
  };

  const handleGenerateFromPrompt = () => {
    if (!aiPrompt) {
      toast.error('Please enter a prompt to generate a workflow');
      return;
    }
    
    toast.success('Generating workflow from your prompt...');
    // @todo - In the real implementation, this will call agentico backend to generate a workflow
    // For now, we will just navigate to the new project page with the prompt simulating the generation with a delay
    setTimeout(() => {
      navigate('/studio/new-project?aiGenerated=true&prompt=' + encodeURIComponent(aiPrompt));
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
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" /> New Project
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
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="max-w-sm pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
            <FileText className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'No projects match your search query' : 'Create your first project to get started'}
          </p>
          <Button onClick={handleCreateProject}>
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    {project.workflows.length} workflows
                  </div>
                  {project.is_shared && (
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
                <Button size="sm" onClick={() => handleOpenProject(project.id)}>
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
