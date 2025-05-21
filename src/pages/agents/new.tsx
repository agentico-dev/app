
import React from 'react';
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
import { ChevronLeft } from 'lucide-react';

// Define form schema
const agentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  goal: z.string().min(10, {
    message: "Goal must be at least 10 characters.",
  }),
  backstory: z.string().min(10, {
    message: "Backstory must be at least 10 characters.",
  }),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

export default function NewAgentPage() {
  const navigate = useNavigate();
  
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: "",
      role: "",
      goal: "",
      backstory: "",
    },
  });

  function onSubmit(values: AgentFormValues) {
    try {
      // Here you would typically save the agent to your backend
      console.log(values);
      
      // Show success message
      toast.success('Agent created successfully!');
      
      // Navigate back to agents list
      navigate('/agents');
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent. Please try again.');
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/agents')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Agents
        </Button>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-green-500/70 bg-clip-text text-transparent">Create New Agent</h1>
        <p className="text-muted-foreground mt-1">
          Configure your AI agent to assist with specific tasks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Details</CardTitle>
          <CardDescription>
            Provide the basic information about your agent. You can add tasks later.
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
                    <FormLabel>Agent Name/Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cloudflare Developer Agent" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for your agent that reflects its purpose.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Developer" {...field} />
                    </FormControl>
                    <FormDescription>
                      The role or title that best describes what this agent does.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., To assist in building and deploying applications on Cloudflare's platform."
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A clear statement of what this agent aims to achieve.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backstory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backstory</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., You are a software developer who builds Cloudflare applications."
                        className="min-h-24" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A narrative that gives your agent context and personality.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/agents')}>
                  Cancel
                </Button>
                <Button type="submit">Create Agent</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
