// app/api/publishedProjectsApiSlice.ts
import { apiSlice } from './apiSlice';
import { Project } from '../types/projectTypes';

export interface PublishedProjectsResponse {
  success: boolean;
  count: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  projects: Project[];
}

export interface AvailableTechnologiesResponse {
  success: boolean;
  technologies: string[];
}

export interface AvailableRolesResponse {
  success: boolean;
  roles: string[];
}

export const publishedProjectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all published projects with optional filtering and pagination
    getPublishedProjects: builder.query<
      PublishedProjectsResponse, 
      { technology?: string; complexity?: string; role?: string; page?: number; limit?: number }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.technology) queryParams.append('technology', params.technology);
        if (params.complexity) queryParams.append('complexity', params.complexity);
        if (params.role) queryParams.append('role', params.role);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        
        return {
          url: `/published-projects?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['PublishedProjects']
    }),
    
    // Get a single published project by ID
    getPublishedProject: builder.query<{ success: boolean; project: Project }, string>({
      query: (projectId) => ({
        url: `/published-projects/${projectId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'PublishedProjects', id }]
    }),
    
    // Get all available technologies from published projects
    getAvailableTechnologies: builder.query<AvailableTechnologiesResponse, void>({
      query: () => ({
        url: '/published-projects/technologies',
        method: 'GET',
      }),
      providesTags: ['PublishedProjects']
    }),
    
    // Get all available roles from published projects
    getAvailableRoles: builder.query<AvailableRolesResponse, void>({
      query: () => ({
        url: '/published-projects/roles',
        method: 'GET',
      }),
      providesTags: ['PublishedProjects']
    }),
  }),
});

export const {
  useGetPublishedProjectsQuery,
  useGetPublishedProjectQuery,
  useGetAvailableTechnologiesQuery,
  useGetAvailableRolesQuery,
} = publishedProjectsApiSlice;