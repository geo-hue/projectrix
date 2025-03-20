import React, { useState } from 'react';
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
  CheckCircle2, 
  XCircle, 
  UserCircle,
  Clock,
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  useGetIncomingCollaborationRequestsQuery,
  useUpdateCollaborationRequestStatusMutation
} from '@/app/api/collaborationApiSlice';

const IncomingRequestsManager = () => {
  const router = useRouter();
  const { 
    data: incomingRequestsData, 
    isLoading: isLoadingRequests,
    refetch: refetchRequests
  } = useGetIncomingCollaborationRequestsQuery();
  
  const [updateRequestStatus, { isLoading: isUpdating }] = useUpdateCollaborationRequestStatusMutation();
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

  // Handle view profile
  const handleViewProfile = (username: string) => {
    router.push(`/profile/${username}`);
  };

  // Handle accept request
  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequestId(requestId);
    try {
      await updateRequestStatus({
        requestId,
        status: 'accepted'
      }).unwrap();
      
      toast.success('Collaboration request accepted!');
      refetchRequests();
    } catch (error: any) {
      console.error('Error accepting request:', error);
      toast.error(error.data?.message || 'Failed to accept request');
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Handle reject request
  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequestId(requestId);
    try {
      await updateRequestStatus({
        requestId,
        status: 'rejected'
      }).unwrap();
      
      toast.error('Collaboration request rejected');
      refetchRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast.error(error.data?.message || 'Failed to reject request');
    } finally {
      setProcessingRequestId(null);
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

  if (isLoadingRequests) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingRequests = incomingRequestsData?.requests?.filter(
    req => req.status === 'pending'
  ) || [];

  const processedRequests = incomingRequestsData?.requests?.filter(
    req => req.status === 'accepted' || req.status === 'rejected'
  ) || [];

  return (
    <div className="space-y-6">
      {/* Pending Requests Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Pending Requests ({pendingRequests.length})</h2>
        
        {pendingRequests.length === 0 ? (
          <Card className="bg-muted/20 border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-primary/70" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You don&apos;t have any pending collaboration requests at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingRequests.map((request) => {
              // Group requests by project
              const projectId = request.projectId._id;
              const projectTitle = request.projectId.title;
              const requestsForSameRole = pendingRequests.filter(
                req => req.projectId._id === projectId && req.role === request.role
              );
              
              return (
                <div key={request._id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 dark:from-blue-400/20 dark:to-blue-700/20 rounded-lg transform -rotate-3 transition-transform duration-300 group-hover:-rotate-2"></div>
                  <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
                  
                  <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{projectTitle}</CardTitle>
                          <CardDescription className="mt-1">
                            Request for <span className="font-medium">{request.role}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex flex-col gap-6">
                        {/* Applicant Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <Avatar 
                            className="h-12 w-12 cursor-pointer" 
                            onClick={() => handleViewProfile(request.applicantId?.username || '')}
                          >
                            <AvatarImage 
                              src={request.applicantId?.avatar} 
                              alt={request.applicantId?.name}
                              onError={(e) => {
                                e.currentTarget.src = `https://avatar.vercel.sh/${request.applicantId?.username}`;
                              }}
                            />
                            <AvatarFallback>{request.applicantId?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{request.applicantId?.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Applied on {formatDate(request.appliedAt)}
                            </p>
                          </div>
                          
                          {/* Applicant Message - if exists */}
                          {request.message && (
                            <div className="sm:ml-auto max-w-sm p-3 bg-muted/30 dark:bg-muted/10 rounded-lg">
                              <p className="text-sm italic">&quot;{request.message}&quot;</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Competition info - if multiple applicants for same role */}
                        {requestsForSameRole.length > 1 && (
                          <div className="rounded-md bg-primary/5 p-3 flex gap-2 items-center">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <p className="text-sm">
                              <strong>{requestsForSameRole.length} applicants</strong> for this role. 
                              Accepting one will automatically reject others.
                            </p>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            className="gap-2"
                            onClick={() => handleViewProfile(request.applicantId?.username || '')}
                          >
                            <UserCircle className="h-4 w-4" />
                            View Profile
                          </Button>
                          <Button 
                            variant="outline"
                            className="gap-2 border-red-500/30 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleRejectRequest(request._id)}
                            disabled={isUpdating && processingRequestId === request._id}
                          >
                            {isUpdating && processingRequestId === request._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            Reject
                          </Button>
                          <Button 
                            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                            onClick={() => handleAcceptRequest(request._id)}
                            disabled={isUpdating && processingRequestId === request._id}
                          >
                            {isUpdating && processingRequestId === request._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Previous Decisions Section */}
      {processedRequests.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Previous Decisions ({processedRequests.length})</h2>
          <div className="grid gap-4">
            {processedRequests.map((request) => (
              <Card key={request._id} className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={request.applicantId?.avatar} 
                          alt={request.applicantId?.name}
                          onError={(e) => {
                            e.currentTarget.src = `https://avatar.vercel.sh/${request.applicantId?.username}`;
                          }}
                        />
                        <AvatarFallback>{request.applicantId?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{request.applicantId?.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={request.status === 'accepted' 
                              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                            }
                          >
                            {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Applied for <span className="font-medium">{request.role}</span> on {request.projectId.title}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleViewProfile(request.applicantId?.username || '')}
                    >
                      <UserCircle className="h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingRequestsManager;