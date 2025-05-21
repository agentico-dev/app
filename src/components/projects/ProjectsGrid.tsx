
import React from 'react';
import ProjectCard, { Project } from './ProjectCard';
import ProjectSkeleton from './ProjectSkeleton';
import EmptyProjectState from './EmptyProjectState';

interface ProjectsGridProps {
  projects: Project[];
  isLoading: boolean;
  type: 'all' | 'favorites' | 'recent';
  searchQuery?: string;
  isAuthenticated: boolean;
}

export function ProjectsGrid({ projects, isLoading, type, searchQuery, isAuthenticated }: ProjectsGridProps) {
  if (isLoading) {
    return <ProjectSkeleton count={type === 'all' ? 3 : 2} />;
  }
  
  // For recent projects, show only the first 3
  const displayProjects = type === 'recent' ? projects.slice(0, 3) : projects;
  
  // For favorites, filter to only show favorites
  const filteredProjects = type === 'favorites' ? displayProjects.filter(p => p.favorite) : displayProjects;

  if (filteredProjects.length === 0) {
    return (
      <EmptyProjectState 
        type={type === 'favorites' ? 'favorites' : (searchQuery ? 'search' : 'all')} 
        searchQuery={searchQuery}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectsGrid;
