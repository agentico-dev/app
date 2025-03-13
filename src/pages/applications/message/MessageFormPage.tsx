
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useApplicationMessage, useApplicationMessages } from '@/hooks/useApplicationMessages';
import { ApplicationMessage } from '@/types/application';
import { toast } from 'sonner';

export default function MessageFormPage() {
  const { applicationId, messageId } = useParams<{ applicationId: string; messageId?: string }>();
  const navigate = useNavigate();
  const isNew = !messageId;
  
  const { data: message, isLoading: isLoadingMessage } = useApplicationMessage(messageId);
  const { createMessage, updateMessage } = useApplicationMessages(applicationId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<Partial<ApplicationMessage>>({
    defaultValues: {
      title: '',
      content: '',
      message_type: 'notification',
      status: 'unread',
    },
  });

  useEffect(() => {
    if (message && !isNew) {
      form.reset({
        title: message.title,
        content: message.content,
        message_type: message.message_type,
        status: message.status,
      });
    }
  }, [message, form, isNew]);

  const onSubmit = async (data: Partial<ApplicationMessage>) => {
    if (!applicationId) return;
    
    setIsSubmitting(true);
    try {
      if (isNew) {
        await createMessage.mutateAsync({
          ...data,
          application_id: applicationId,
        });
        toast.success('Message created successfully');
      } else if (messageId) {
        await updateMessage.mutateAsync({
          ...data,
          id: messageId,
        });
        toast.success('Message updated successfully');
      }
      navigate(`/applications/${applicationId}`);
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('Failed to save message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" asChild>
        <div onClick={() => navigate(`/applications/${applicationId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Application
        </div>
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isNew ? 'Create New Message' : 'Edit Message'}
        </h1>
        <p className="text-muted-foreground">
          {isNew ? 'Create a new message for your application' : 'Update the message details'}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Message Details</CardTitle>
          <CardDescription>
            Fill in the details of your message
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter message title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter message content"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The main content of your message.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="message_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="notification">Notification</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                          <SelectItem value="info">Information</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of this message.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The read status of this message.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/applications/${applicationId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isNew
                      ? 'Creating...'
                      : 'Updating...'
                    : isNew
                    ? 'Create Message'
                    : 'Update Message'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
