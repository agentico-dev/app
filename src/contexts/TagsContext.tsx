
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/application';
import { toast } from '@/components/ui/use-toast';

interface TagsContextType {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  addTag: (tag: Omit<Tag, 'id'>) => Promise<Tag | null>;
  deleteTag: (tagId: string) => Promise<boolean>;
  assignTagToResource: (resourceType: string, resourceId: string, tagId: string) => Promise<boolean>;
  removeTagFromResource: (resourceType: string, resourceId: string, tagId: string) => Promise<boolean>;
  getResourceTags: (resourceType: string, resourceId: string) => Promise<Tag[]>;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  // Query to fetch all tags
  const { data: tags = [], isLoading, error: queryError } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      try {
        // This is a placeholder - in a real implementation, we would query the tags table
        // For now, let's return some mock data
        return [
          { id: '1', name: 'API', category: 'type' },
          { id: '2', name: 'Integration', category: 'type' },
          { id: '3', name: 'Important', category: 'priority' },
          { id: '4', name: 'Frontend', category: 'area' },
          { id: '5', name: 'Backend', category: 'area' },
        ];
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch tags'));
        return [];
      }
    }
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError instanceof Error ? queryError : new Error('Failed to fetch tags'));
    }
  }, [queryError]);

  const addTag = async (tag: Omit<Tag, 'id'>): Promise<Tag | null> => {
    try {
      // This would be implemented to insert a new tag into the database
      // For now, just return a mock response
      const newTag: Tag = {
        id: Math.random().toString(36).substr(2, 9),
        name: tag.name,
        category: tag.category
      };
      return newTag;
    } catch (err) {
      console.error('Error adding tag:', err);
      toast({
        title: 'Error adding tag',
        description: err instanceof Error ? err.message : 'Failed to add tag',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteTag = async (tagId: string): Promise<boolean> => {
    try {
      // This would be implemented to delete a tag from the database
      return true;
    } catch (err) {
      console.error('Error deleting tag:', err);
      toast({
        title: 'Error deleting tag',
        description: err instanceof Error ? err.message : 'Failed to delete tag',
        variant: 'destructive',
      });
      return false;
    }
  };

  const assignTagToResource = async (
    resourceType: string, 
    resourceId: string, 
    tagId: string
  ): Promise<boolean> => {
    try {
      // This would be implemented to assign a tag to a resource
      return true;
    } catch (err) {
      console.error('Error assigning tag:', err);
      toast({
        title: 'Error assigning tag',
        description: err instanceof Error ? err.message : 'Failed to assign tag',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeTagFromResource = async (
    resourceType: string, 
    resourceId: string, 
    tagId: string
  ): Promise<boolean> => {
    try {
      // This would be implemented to remove a tag from a resource
      return true;
    } catch (err) {
      console.error('Error removing tag:', err);
      toast({
        title: 'Error removing tag',
        description: err instanceof Error ? err.message : 'Failed to remove tag',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getResourceTags = async (resourceType: string, resourceId: string): Promise<Tag[]> => {
    try {
      // This would be implemented to get tags for a specific resource
      // For now, just return a subset of the mock tags
      return tags.slice(0, 2);
    } catch (err) {
      console.error('Error fetching resource tags:', err);
      toast({
        title: 'Error fetching tags',
        description: err instanceof Error ? err.message : 'Failed to fetch resource tags',
        variant: 'destructive',
      });
      return [];
    }
  };

  return (
    <TagsContext.Provider
      value={{
        tags,
        isLoading,
        error,
        addTag,
        deleteTag,
        assignTagToResource,
        removeTagFromResource,
        getResourceTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = (): TagsContextType => {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
};
