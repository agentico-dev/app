
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/application';
import { toast } from '@/components/ui/use-toast';
import { apiTable } from '@/utils/supabaseHelpers';

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
        const { data, error } = await apiTable('tags')
          .select('*')
          .order('name');
        
        if (error) throw error;
        return data as Tag[];
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
      const { data, error } = await apiTable('tags')
        .insert(tag)
        .select()
        .single();
      
      if (error) throw error;
      return data as Tag;
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
      const { error } = await apiTable('tags')
        .delete()
        .eq('id', tagId);
      
      if (error) throw error;
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
      const { data, error } = await apiTable('resource_tags')
        .insert({
          resource_type: resourceType,
          resource_id: resourceId,
          tag_id: tagId
        })
        .select();
      
      if (error) throw error;
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
      const { error } = await apiTable('resource_tags')
        .delete()
        .match({
          resource_type: resourceType,
          resource_id: resourceId,
          tag_id: tagId
        });
      
      if (error) throw error;
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
      const { data, error } = await apiTable('resource_tags')
        .select(`
          tags:tag_id (*)
        `)
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId);
      
      if (error) throw error;
      
      // Fix the type casting - properly map the response to Tag objects
      if (data && Array.isArray(data)) {
        return data.map(item => (item.tags as unknown) as Tag);
      }
      return [];
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
