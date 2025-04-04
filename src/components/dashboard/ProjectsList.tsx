
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ArrowUpRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectData {
  id: string;
  name: string;
  slug?: string;
  tools_count: number;
  servers_count: number;
  status: string;
}

interface ProjectsListProps {
  projects: ProjectData[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <Card className="h-full bg-gradient-to-br from-card to-background/80 backdrop-blur-sm border-opacity-40 shadow-lg">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>
          Your recently updated projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.length > 0 ? projects.map((project, index) => (
            <motion.div 
              key={project.id} 
              className="flex items-center justify-between space-x-4 p-2 hover:bg-background/50 rounded-md transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-sm">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{project.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {project.tools_count} tools · {project.servers_count} servers
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className={`mr-2 ${
                  project.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 
                  project.status === 'Development' ? 'bg-blue-100 text-blue-800 border-blue-300' : 
                  'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {project.status}
                </Badge>
                <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 transition-colors duration-300">
                  <Link to={`/projects/${project.slug ? project.slug : project.id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">View project</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects yet</p>
              <Button variant="outline" className="mt-2" asChild>
                <Link to="/projects/new">Create your first project</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
