
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationMessages } from '@/hooks/useApplicationMessages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MessageSquare, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { ApplicationMessage } from '@/types/application';

interface MessagesListProps {
  applicationId: string;
}

export default function MessagesList({ applicationId }: MessagesListProps) {
  const navigate = useNavigate();
  const { messages, isLoading, error, deleteMessage, markAsRead } = useApplicationMessages(applicationId);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageToDelete, setMessageToDelete] = useState<ApplicationMessage | null>(null);

  const filteredMessages = messages?.filter(message => 
    message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      deleteMessage.mutate(messageToDelete.id);
      setMessageToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'notification':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'alert':
        return <MessageSquare className="h-4 w-4 text-red-500" />;
      case 'info':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Error loading messages</h3>
        <p className="text-muted-foreground">
          There was a problem loading the message list. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredMessages && filteredMessages.length > 0 ? (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className={`overflow-hidden ${message.status === 'unread' ? 'border-blue-300' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(message.message_type)}
                    <CardTitle className="text-lg font-medium">{message.title}</CardTitle>
                  </div>
                  <Badge variant={message.status === 'unread' ? 'default' : 'outline'}>
                    {message.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {message.content}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {formatDate(message.created_at)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/applications/${applicationId}/messages/${message.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  {message.status === 'unread' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead.mutate(message.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Mark as Read
                    </Button>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setMessageToDelete(message)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium">No messages found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "No messages match your search criteria." : "This application doesn't have any messages yet."}
          </p>
          <Button onClick={() => navigate(`/applications/${applicationId}/messages/new`)}>
            Create your first message
          </Button>
        </div>
      )}

      <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message
              "{messageToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
