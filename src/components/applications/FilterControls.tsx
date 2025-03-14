
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from "@/types/application";
import { Check, Filter, Search, Tags } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface FilterControlsProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  statusOptions: { label: string; value: string | null }[];
  selectedStatus: string | null;
  onStatusChange: (value: string | null) => void;
  tags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function FilterControls({
  searchValue,
  onSearchValueChange,
  statusOptions,
  selectedStatus,
  onStatusChange,
  tags,
  selectedTags,
  onTagsChange,
}: FilterControlsProps) {
  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchValueChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={selectedStatus === null ? 'all' : selectedStatus}
        onValueChange={(value) => onStatusChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value ?? 'all'} value={option.value ?? 'all'}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full md:w-[180px] justify-between">
            <div className="flex items-center">
              <Tags className="mr-2 h-4 w-4" />
              <span>Tags</span>
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 font-normal">
                  {selectedTags.length}
                </Badge>
              )}
            </div>
            <Filter className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleToggleTag(tag.id)}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted opacity-50'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span>{tag.name}</span>
                      </CommandItem>
                    );
                  })}
                </ScrollArea>
              </CommandGroup>
              <Separator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => onTagsChange([])}
                  className="justify-center text-center"
                >
                  Clear filters
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
