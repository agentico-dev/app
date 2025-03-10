
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { CircuitBoard, Filter, Plus, Search, Server, Star, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  serversCount: number;
  applicationsCount: number;
  agentsCount: number;
  status: 'Active' | 'Development' | 'Maintenance' | 'Archived';
  favorite: boolean;
  tags: string[];
}

const mockAITools: AITool[] = [
  {
    id: '1',
    name: 'Text Summarizer',
    description: 'Automatically summarize long documents and articles',
    category: 'NLP',
    serversCount: 2,
    applicationsCount: 3,
    agentsCount: 1,
    status: 'Active',
    favorite: true,
    tags: ['nlp', 'text-processing', 'summarization'],
  },
  {
    id: '2',
    name: 'Sentiment Analyzer',
    description: 'Analyze text for emotional tone and sentiment',
    category: 'NLP',
    serversCount: 1,
    applicationsCount: 4,
    agentsCount: 2,
    status: 'Active',
    favorite: false,
    tags: ['nlp', 'sentiment', 'analysis'],
  },
  {
    id: '3',
    name: 'Image Classifier',
    description: 'Identify objects and scenes in images',
    category: 'Computer Vision',
    serversCount: 3,
    applicationsCount: 2,
    agentsCount: 0,
    status: 'Development',
    favorite: true,
    tags: ['vision', 'classification', 'detection'],
  },
  {
    id: '4',
    name: 'Entity Extractor',
    description: 'Extract named entities from unstructured text',
    category: 'NLP',
    serversCount: 1,
    applicationsCount: 2,
    agentsCount: 1,
    status: 'Active',
    favorite: false,
    tags: ['nlp', 'entity-extraction', 'information-retrieval'],
  },
  {
    id: '5',
    name: 'Speech-to-Text',
    description: 'Convert audio recordings to written text',
    category: 'Speech',
    serversCount: 2,
    applicationsCount: 1,
    agentsCount: 0,
    status: 'Development',
    favorite: false,
    tags: ['speech', 'audio-processing', 'transcription'],
  },
  {
    id: '6',
    name: 'Recommendation Engine',
    description: 'Generate personalized recommendations based on user behavior',
    category: 'Machine Learning',
    serversCount: 4,
    applicationsCount: 2,
    agentsCount: 3,
    status: 'Active',
    favorite: true,
    tags: ['recommendations', 'ml', 'personalization'],
  },
];

export function AIToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const filteredTools = mockAITools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'favorite') return matchesSearch && tool.favorite;
    if (activeFilter === 'active') return matchesSearch && tool.status === 'Active';
    if (activeFilter === 'nlp') return matchesSearch && tool.category === 'NLP';
    if (activeFilter === 'vision') return matchesSearch && tool.category === 'Computer Vision';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Tools</h2>
          <p className="text-muted-foreground">
            Browse and manage your AI services and capabilities
          </p>
        </div>
        <Button asChild>
          <Link to="/ai-tools/new">
            <Plus className="mr-2 h-4 w-4" />
            New AI Tool
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search AI Tools..."
            className="pl-8 w-full md:max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveFilter(null)}>
              All AI Tools
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('favorite')}>
              Favorites
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setActiveFilter('nlp')}>
              NLP
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter('vision')}>
              Computer Vision
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <AIToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.filter(t => t.favorite).map((tool) => (
              <AIToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.slice(0, 3).map((tool) => (
              <AIToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AIToolCard({ tool }: { tool: AITool }) {
  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="p-4 pb-0 flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{tool.name}</CardTitle>
            {tool.favorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-2" />
            )}
          </div>
          <CardDescription className="mt-1">
            {tool.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {tool.category}
          </Badge>
          {tool.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Server className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{tool.serversCount} servers</span>
          </div>
          <div className="flex items-center">
            <CircuitBoard className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{tool.applicationsCount} apps</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{tool.agentsCount} agents</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={`
          ${tool.status === 'Active' ? 'tag-green' : ''}
          ${tool.status === 'Development' ? 'tag-purple' : ''}
          ${tool.status === 'Maintenance' ? 'tag-yellow' : ''}
          ${tool.status === 'Archived' ? 'tag-red' : ''}
        `}>
          {tool.status}
        </Badge>
        <Button asChild>
          <Link to={`/ai-tools/${tool.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AIToolsPage;
