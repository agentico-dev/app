
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AgentTask } from '@/types/agent';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  }
];

// Define form schema
const taskFormSchema = z.object({
  name: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  expectedOutput: z.string().min(10, {
    message: "Expected output must be at least 10 characters.",
  }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export default function NewTaskPage() {
  const navigate = useNavigate();
  const [selectedContextTasks, setSelectedContextTasks] = useState<string[]>([]);
  const [availableTasks, setAvailableTasks] = useState<AgentTask[]>(mockTasks);
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      expectedOutput: "",
    },
  });

  function onSubmit(values: TaskFormValues) {
    try {
      // Here you would typically save the task to your backend
      const newTask = {
        ...values,
        context: selectedContextTasks
      };
      
      console.log(newTask);
      
      // Show success message
      toast.success('Task created successfully!');
      
      // Navigate back to tasks list
      navigate('/agents/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    }
  }

  const addContextTask = (taskId: string) => {
    if (!selectedContextTasks.includes(taskId)) {
      setSelectedContextTasks([...selectedContextTasks, taskId]);
    }
  };

  const removeContextTask = (taskId: string) => {
    setSelectedContextTasks(selectedContextTasks.filter(id => id !== taskId));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/agents/tasks')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-green-500/70 bg-clip-text text-transparent">Create New Task</h1>
        <p className="text-muted-foreground mt-1">
          Define a task that can be performed by your AI agents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Provide the details of the task including what it should accomplish and its expected output.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Create Cloudflare Worker" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive name for this task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Create a Cloudflare Worker that handles API requests."
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description of what this task should accomplish.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedOutput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Output</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Working Cloudflare Worker code with proper error handling."
                        className="min-h-24" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what the output of this task should look like.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-sm font-medium mb-2">Context Tasks</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select tasks whose output will be used as context for this task.
                </p>
                
                {selectedContextTasks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedContextTasks.map(taskId => {
                      const task = availableTasks.find(t => t.id === taskId);
                      return (
                        <Badge key={taskId} variant="secondary" className="px-2 py-1">
                          {task?.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => removeContextTask(taskId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Available Tasks</h4>
                  {availableTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tasks available.</p>
                  ) : (
                    <div className="grid gap-2">
                      {availableTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <p className="text-sm font-medium">{task.name}</p>
                            <p className="text-xs text-muted-foreground">{task.description}</p>
                          </div>
                          {!selectedContextTasks.includes(task.id) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addContextTask(task.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/agents/tasks')}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
