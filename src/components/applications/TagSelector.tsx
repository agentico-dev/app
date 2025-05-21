
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TagBadge } from './TagBadge';

interface TagsSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

function TagsSelector({ selectedTags = [], onChange }: TagsSelectorProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      onChange(updatedTags);
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag"
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={handleAddTag}
          disabled={!newTag.trim()}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag, index) => (
            <TagBadge
              key={index}
              name={tag}
              onRemove={() => handleRemoveTag(tag)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TagsSelector;
