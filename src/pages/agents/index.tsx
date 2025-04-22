
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Agent } from '@/types/agent';
import { useNavigate } from 'react-router';

// Mock data for initial display
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Cloudflare Developer Agent',
    role: 'Developer',
    goal: 'To assist in building and deploying applications on Cloudflare\'s platform.',
    backstory: 'You are a software developer who builds Cloudflare applications.',
    tasks: [
      'Provide code examples for Cloudflare Workers.',
      'Assist with setting up Cloudflare Pages.',
      'Help troubleshoot issues with Cloudflare APIs.',
      'Offer best practices for using Cloudflare\'s CDN and security features.',
      'Guide users in deploying serverless applications on Cloudflare.',
      'Explain how to use Cloudflare\'s analytics and monitoring tools.',
      'Provide information on integrating third-party services with Cloudflare.'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1'
  },
  {
    id: '2',
    name: 'Career Coach',
    role: 'Coach',
    goal: 'To assist users in building and managing their careers, identifying key qualifications in resumes, and finding the perfect fit between the coachee and job roles',
    backstory: 'You are a career coach who helps users build and manage their careers and find the perfect fit for better job opportunities.',
    tasks: [
      'Guide resume writing and formatting.',
      'Assist with job search strategies and techniques.',
      'Help users prepare for interviews and mock interviews.',
      'Offer advice on networking and building professional relationships.',
      'Guide users in identifying their strengths and weaknesses.',
      'Provide information on industry trends and job market insights.',
      'Assist with career development planning and goal setting.'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1'
  }
];

export default function AgentsPage() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter(
    agent => agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAgent = () => {
    navigate('/agents/new');
  };

  const handleViewAgent = (agentId: string) => {
    navigate(`/agents/${agentId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-green-500/70 bg-clip-text text-transparent">Agents</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage AI agents to assist with various tasks
          </p>
        </div>
        <Button onClick={handleCreateAgent}>
          <Plus className="mr-2 h-4 w-4" /> New Agent
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Your Agents</h2>
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="max-w-sm pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
            <Bot className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium">No agents found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'No agents match your search query' : 'Create your first agent to get started'}
          </p>
          <Button onClick={handleCreateAgent}>
            <Plus className="mr-2 h-4 w-4" /> Create Agent
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription className="line-clamp-2">{agent.goal}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Role: {agent.role}</p>
                  <p className="mt-2 line-clamp-2">Backstory: {agent.backstory}</p>
                  <p className="mt-2">Tasks: {agent.tasks.length}</p>
                </div>
              </CardContent>
              <CardFooter className="pt-3 flex justify-between border-t">
                <Button variant="outline" size="sm" onClick={() => handleViewAgent(agent.id)}>
                  View Details
                </Button>
                <Button size="sm" onClick={() => navigate(`/agents/playground/${agent.id}`)}>
                  Use in Playground
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
