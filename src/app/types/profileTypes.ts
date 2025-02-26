export interface UserProfile {
    _id: string;
    userId: string;
    bio: string;
    skills: string[];
    website: string;
    githubProfile: string;
    twitterProfile: string;
    linkedinProfile: string;
    availability: 'available' | 'limited' | 'unavailable';
    hoursPerWeek: string;
    preferredTechnologies: string[];
    preferredRoles: string[];
    publicEmail: boolean;
  }
  
  export interface PublicProfile {
    user: {
      _id: string;
      name: string;
      username: string;
      avatar: string;
      email?: string;
      createdAt: string;
    };
    profile: UserProfile;
    publishedProjects: Array<{
      _id: string;
      title: string;
      subtitle: string;
      description: string;
      technologies: string[];
      complexity: {
        level: string;
        percentage: number;
      };
      teamStructure: {
        roles: Array<{
          title: string;
          skills: string[];
          responsibilities: string[];
          filled: boolean;
        }>;
      };
      createdAt: string;
    }>;
  }