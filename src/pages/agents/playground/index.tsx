
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Bot, Wrench, ListTodo, Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Agent, AgentTool, AgentTask } from '@/types/agent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Mock data for initial display
const mockAgent: Agent = {
  id: '1',
  name: 'Cloudflare Developer Agent',
  role: 'Developer',
  goal: 'To assist in building and deploying applications on Cloudflare\'s platform.',
  backstory: 'You\'re a software developer that build cloudflare applications.',
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
};

const mockTools: AgentTool[] = [
  {
    id: '1',
    name: 'cf_worker_put',
    description: 'Create a Cloudflare Worker with the provided code',
    function: 'async function createWorker(code, name) { /* implementation */ }',
  },
  {
    id: '2',
    name: 'sl_slack_list_channels',
    description: 'List all channels in a Slack workspace',
    function: 'async function listSlackChannels() { /* implementation */ }',
  },
  {
    id: '3',
    name: 'sl_slack_post_message',
    description: 'Post a message to a Slack channel',
    function: 'async function postToSlack(channel, message) { /* implementation */ }',
  }
];

const mockTasks: AgentTask[] = [
  {
    id: '1',
    name: 'Tasks 1',
    description: 'Create a Cloudflare Worker that handles API requests.',
    expectedOutput: 'Working Cloudflare Worker code with proper error handling.',
    context: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1'
  },
  {
    id: '2',
    name: 'Tasks 2',
    description: 'Setup a new Cloudflare Pages project with GitHub integration.',
    expectedOutput: 'Instructions for setting up Cloudflare Pages with proper configuration.',
    context: ['1'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1'
  },
  {
    id: '3',
    name: 'Tasks 3',
    description: 'Setup a notification system to alert when deployments complete.',
    expectedOutput: 'A working notification system using Slack.',
    context: ['1', '2'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '1'
  },
];

export default function PlaygroundPage() {
  const [selectedTab, setSelectedTab] = useState('agent');
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message to conversation
    setConversation(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      // Example responses based on input
      let response = "I'll help you with that. Could you provide more details about your specific requirements?";
      
      if (userInput.toLowerCase().includes('cloudflare worker')) {
        response = "To create a Cloudflare Worker, you'll need to follow these steps:\n\n1. Set up a Cloudflare account\n2. Install Wrangler CLI: `npm install -g wrangler`\n3. Initialize a new project: `wrangler init my-worker`\n4. Edit your Worker code\n5. Deploy using: `wrangler publish`\n\nWould you like me to provide a code example for a specific use case?";
      } else if (userInput.toLowerCase().includes('slack')) {
        response = "I can help you integrate with Slack. Here are the available tools:\n• List channels in your workspace\n• Post messages to a channel\n\nWhich specific aspect of Slack integration are you interested in?";
      }
      
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1500);
    
    // Clear input
    setUserInput('');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left panel - Agent details */}
        <div className="lg:col-span-5 space-y-6">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-green-500/70 bg-clip-text text-transparent">
            {mockAgent.name}
            <span className="text-red-500 text-sm ml-2 font-normal">agentName/Role</span>
          </h1>
          
          <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="agent">Agent</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Backstory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{mockAgent.backstory}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{mockAgent.goal}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium">Tools</h3>
                  <Badge className="ml-2 bg-gray-200 text-gray-800">{mockTools.length}</Badge>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-3 w-3 mr-1" /> Add Tool
                </Button>
              </div>
              
              <div className="space-y-2">
                {mockTools.map(tool => (
                  <div 
                    key={tool.id} 
                    className="flex items-center p-2 border rounded-md"
                  >
                    <Wrench className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-xs text-gray-500">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium">Tasks</h3>
                  <Badge className="ml-2 bg-gray-200 text-gray-800">{mockTasks.length}</Badge>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-3 w-3 mr-1" /> Add Task
                </Button>
              </div>
              
              <div className="space-y-2">
                {mockTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center p-2 border rounded-md"
                  >
                    <ListTodo className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.name}</p>
                      <p className="text-xs text-gray-500">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right panel - Sandbox */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col">
            <CardHeader className="px-4 py-2 border-b">
              <div className="flex items-center">
                <CardTitle className="text-lg">Sandbox</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 flex flex-col h-[70vh]">
              {/* Chat area */}
              <ScrollArea className="flex-1 p-4">
                {conversation.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                    <span className="text-red-500">When empty, give a hint to the user</span>
                    <p className="mt-2">Ask anything to {mockAgent.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                          <p className="animate-pulse">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              
              {/* Input area */}
              <div className="p-4 border-t flex gap-2">
                <Input 
                  placeholder="Type a message..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
