
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Server as ServerType } from "@/types/server";
import { Server, Star, StarIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { TagBadge } from "@/components/applications/TagBadge";
import { Tag } from "@/types/tag";

interface ServerCardProps {
  server: ServerType;
  onToggleFavorite: (id: string, favorite: boolean) => Promise<void>;
  tags: Tag[];
}

const statusColors = {
  'active': 'bg-green-500',
  'inactive': 'bg-red-500',
  'maintenance': 'bg-yellow-500',
  'development': 'bg-blue-500',
  'deprecated': 'bg-gray-500',
  'planning': 'bg-purple-500',
};

export function ServerCard({ server, onToggleFavorite, tags }: ServerCardProps) {
  const navigate = useNavigate();

  const handleServerClick = () => {
    navigate(`/servers/${server.id}`);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggleFavorite(server.id, server.favorite);
  };

  return (
    <Card 
      key={server.id} 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleServerClick}
    >
      <div className="relative">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  statusColors[server.status.toLowerCase() as keyof typeof statusColors] || 'bg-gray-500'
                }`}
              />
              <CardTitle className="text-lg">{server.name}</CardTitle>
            </div>
            <button
              onClick={handleToggleFavorite}
              className="text-muted-foreground hover:text-yellow-400 transition-colors"
              aria-label={server.favorite ? "Remove from favorites" : "Add to favorites"}
            >
              {server.favorite ? (
                <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ) : (
                <Star className="h-5 w-5" />
              )}
            </button>
          </div>
          <CardDescription className="line-clamp-2">
            {server.description || "No description available"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <div className="flex items-center mr-4">
              <Server className="h-4 w-4 mr-1" />
              <span>{server.type}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {server.tags.slice(0, 3).map((tagId) => (
              <TagBadge 
                key={tagId} 
                name={tags.find(tag => tag.id === tagId)?.name || 'Unknown'} 
              />
            ))}
            {server.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{server.tags.length - 3} more
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          Created {new Date(server.created_at).toLocaleDateString()}
        </CardFooter>
      </div>
    </Card>
  );
}

export default ServerCard;
