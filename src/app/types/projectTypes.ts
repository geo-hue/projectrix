// app/types/projectTypes.ts

export interface Complexity {
    level: string;
    percentage: number;
  }
  
  export interface TeamSize {
    type: string;
    count: string;
  }
  
  export interface Duration {
    type: string;
    estimate: string;
  }
  
  export interface Role {
    title: string;
    skills: string[];
    responsibilities: string[];
  }
  
  export interface TeamStructure {
    roles: Role[];
  }
  
  export interface Features {
    core: string[];
    additional: string[];
  }
  
  export interface Project {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    userId: string;
    technologies: string[];
    complexity: Complexity;
    teamSize: TeamSize;
    duration: Duration;
    category: string;
    features: Features;
    teamStructure: TeamStructure;
    learningOutcomes: string[];
    isSaved: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GenerateProjectParams {
    technologies: string[];
    complexity: {
      level: string;
      percentage: number;
    };
    duration: string;
    teamSize: string;
    category: string;
  }
  
  export interface ProjectResponse {
    success: boolean;
    project: Project;
  }
  
  export interface ProjectsResponse {
    success: boolean;
    projects: Project[];
  }
  
  export interface GenerateProjectResponse {
    success: boolean;
    project: Project;
  }
  
  export interface ActionResponse {
    success: boolean;
    message: string;
  }