export interface CollaborationRequest {
    _id: string;
    projectId: {
      _id: string;
      title: string;
      subtitle: string;
      technologies: string[];
      teamStructure: {
        roles: Array<{
          title: string;
          skills: string[];
          responsibilities: string[];
          filled: boolean;
        }>;
      };
    };
    publisherId?: {
      _id: string;
      name: string;
      username: string;
      avatar: string;
      email?: string;
    };
    applicantId?: {
      _id: string;
      name: string;
      username: string;
      avatar: string;
      email?: string;
    };
    role: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: string;
  }
  
  export interface CollaborationResponse {
    success: boolean;
    message: string;
    collaborationRequest: CollaborationRequest;
  }
  
  export interface UpdateRequestResponse {
    success: boolean;
    message: string;
    request: CollaborationRequest;
  }
  