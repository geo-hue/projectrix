import React, { useState } from 'react';
import {motion} from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription, 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  ArrowRight,
  Calendar,
  Loader2, 
  AlertCircle,
  Framer
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useGetMyCollaborationRequestsQuery } from '@/app/api/collaborationApiSlice';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessageMutation } from '@/app/api/messageApiSlice';

const MyRequestsManager = () => {
  const router = useRouter();
  const { 
    data: myRequestsData, 
    isLoading 
  } = useGetMyCollaborationRequestsQuery();
  
  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
  
  // State for message dialog
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageReceiver, setMessageReceiver] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  // Handle view project
  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  // Handle open message dialog
  const handleOpenMessageDialog = (receiver) => {
    setMessageReceiver(receiver);
    setMessageDialogOpen(true);
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageReceiver || !messageContent.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendMessage({
        receiverId: messageReceiver._id,
        content: messageContent.trim()
      }).unwrap();
      
      toast.success('Message sent successfully!');
      setMessageDialogOpen(false);
      setMessageContent('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.data?.message || 'Failed to send message');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">Rejected</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const requests = myRequestsData?.requests || [];
  
  if (requests.length === 0) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-10 rounded-lg border border-black/10 dark:border-white/10 inline-block"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-primary/70" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Collaboration Requests</h3>
          <p className="text-muted-foreground mb-6">
            You haven't applied to collaborate on any projects yet. Browse available projects to find ones that match your skills.
          </p>
          <Button 
            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
            onClick={() => router.push('/ideas')}
          >
            Browse Projects
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {requests.map((request) => (
        <div key={request._id} className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg transform rotate-1 transition-transform duration-300 group-hover:rotate-0"></div>
          <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
          
          <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{request.projectId.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Avatar 
                      className="h-6 w-6" 
                    >
                      <AvatarImage 
                        src={request.publisherId.avatar} 
                        alt={request.publisherId.name}
                        onError={(e) => {
                          e.currentTarget.src = `https://avatar.vercel.sh/${request.publisherId.username}`;
                        }}
                      />
                      <AvatarFallback>{request.publisherId.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      Owned by <span className="font-medium">{request.publisherId.name}</span>
                    </span>
                  </CardDescription>
                </div>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <Badge variant="secondary">{request.role}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Applied on {formatDate(request.appliedAt)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {request.status === 'accepted' && (
                    <Button 
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleOpenMessageDialog(request.publisherId)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    onClick={() => handleViewProject(request.projectId._id)}
                  >
                    View Project <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black border border-black/20 dark:border-white/20">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Your message will be sent directly to {messageReceiver?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <Textarea
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="h-32 resize-none"
            />
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setMessageDialogOpen(false)}
              disabled={isSendingMessage}
              className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isSendingMessage || !messageContent.trim()}
              className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
            >
              {isSendingMessage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyRequestsManager;