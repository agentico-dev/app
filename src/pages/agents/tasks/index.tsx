
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, ListTodo } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentTask } from '@/types/agent';
import { useNavigate } from 'react-router';

// Mock data for initial display
const mockTasks: AgentTask[] = [
  {
    id: '1',
    name: 'Create Cloudflare Worker',
    description: 'Create a Cloudflare Worker that handles API requests.',
    expectedOutput: 'Working Cloudflare Worker code with proper error handling.',
    context: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1'
  },
  {
    id: '2',
    name: 'Setup Cloudflare Pages',
    description: 'Setup a new Cloudflare Pages project with GitHub integration.',
    expectedOutput: 'Instructions for setting up Cloudflare Pages with proper configuration.',
    context: ['1'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1'
  },
  {
    id: '3',
    name: 'Resume Review',
    description: 'Review the user\'s resume and provide feedback for improvement.',
    expectedOutput: 'Detailed feedback on resume with specific suggestions for improvement.',
    context: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1'
  }
];

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<AgentTask[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(
    task => task.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTask = () => {
    navigate('/agents/tasks/new');
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/agents/tasks/${taskId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-green-500/70 bg-clip-text text-transparent">Agent Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage tasks that can be performed by your AI agents
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Available Tasks</h2>
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="max-w-sm pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
            <ListTodo className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'No tasks match your search query' : 'Create your first task to get started'}
          </p>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{task.name}</CardTitle>
                <CardDescription className="line-clamp-2">{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">
                  <p className="mt-2 line-clamp-2"><strong>Expected Output:</strong> {task.expectedOutput}</p>
                  <p className="mt-2"><strong>Context Tasks:</strong> {task.context.length > 0 ? task.context.length : 'None'}</p>
                </div>
              </CardContent>
              <CardFooter className="pt-3 flex justify-between border-t">
                <Button variant="outline" size="sm" onClick={() => handleViewTask(task.id)}>
                  View Details
                </Button>
                <Button size="sm" onClick={() => navigate(`/agents/tasks/${task.id}/edit`)}>
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
