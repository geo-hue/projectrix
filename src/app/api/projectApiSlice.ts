// app/api/projectApiSlice.ts
import { apiSlice } from './apiSlice';
import { 
  GenerateProjectParams, 
  ProjectResponse, 
  ProjectsResponse, 
  ActionResponse,
} from '../types/projectTypes';

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Generate a new project
    generateProject: builder.mutation<ProjectResponse, GenerateProjectParams>({
      query: (params) => ({
        url: '/generate',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Projects', 'CurrentProject'],
    }),

    // Generate another project
    generateAnother: builder.mutation<ProjectResponse, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/generate-another`,
        method: 'POST',
      }),
      invalidatesTags: ['Projects', 'CurrentProject'],
    }),

    // Get user's generated projects
    getProjects: builder.query<ProjectsResponse, void>({
      query: () => ({
        url: '/projects',
        method: 'GET',
      }),
      providesTags: ['Projects'],
    }),

    // Get user's saved projects
    getSavedProjects: builder.query<ProjectsResponse, void>({
      query: () => ({
        url: '/user/saved-projects',
        method: 'GET',
      }),
      providesTags: ['SavedProjects'],
    }),

    // Save a project
    saveProject: builder.mutation<ProjectResponse, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/save`,
        method: 'PATCH',
      }),
      // Optimistic update
      async onQueryStarted(projectId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Update projects list
          dispatch(
            projectApiSlice.util.updateQueryData('getProjects', undefined, (draft) => {
              const projectIndex = draft.projects.findIndex(p => p._id === projectId);
              if (projectIndex !== -1) {
                draft.projects[projectIndex] = data.project;
              }
            })
          );

          // Update current project if it's the same
          dispatch(
            projectApiSlice.util.updateQueryData('getProject', projectId, () => {
              return { success: true, project: data.project };
            })
          );
        } catch {}
      },
      invalidatesTags: ['Projects', 'SavedProjects'],
    }),

    // Start a project
    startProject: builder.mutation<ActionResponse, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/start`,
        method: 'POST',
      }),
      invalidatesTags: ['Projects', 'SavedProjects'],
    }),

    // Publish a project
    publishProject: builder.mutation<ActionResponse, { projectId: string, selectedRole?: string }>({
      query: ({ projectId, selectedRole }) => ({
        url: `/projects/${projectId}/publish`,
        method: 'POST',
        body: { selectedRole }, // Add the selectedRole to the request body
      }),
      invalidatesTags: ['Projects', 'SavedProjects', 'PublishedProjects'],
    }),

    // Get a single project by ID
    getProject: builder.query<ProjectResponse, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Projects', id }],
    }),
    
    // Submit user project
    submitUserProject: builder.mutation<ProjectResponse, any>({
      query: (projectData) => ({
        url: '/submit-project',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Projects', 'SavedProjects'],
    }),
    
    // Edit project (new)
    editProject: builder.mutation<ProjectResponse, { projectId: string, projectData: any }>({
      query: ({ projectId, projectData }) => ({
        url: `/projects/${projectId}/edit`,
        method: 'PUT',
        body: projectData,
      }),
      invalidatesTags: ['Projects', 'SavedProjects', 'CurrentProject'],
      // Optimistic update
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Update projects list
          dispatch(
            projectApiSlice.util.updateQueryData('getProjects', undefined, (draft) => {
              const projectIndex = draft.projects.findIndex(p => p._id === projectId);
              if (projectIndex !== -1) {
                draft.projects[projectIndex] = data.project;
              }
            })
          );
          
          // Update saved projects list
          dispatch(
            projectApiSlice.util.updateQueryData('getSavedProjects', undefined, (draft) => {
              const projectIndex = draft.projects.findIndex(p => p._id === projectId);
              if (projectIndex !== -1) {
                draft.projects[projectIndex] = data.project;
              }
            })
          );

          // Update current project if it's the same
          dispatch(
            projectApiSlice.util.updateQueryData('getProject', projectId, () => {
              return { success: true, project: data.project };
            })
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useGenerateProjectMutation,
  useGenerateAnotherMutation,
  useGetProjectsQuery,
  useGetSavedProjectsQuery,
  useSaveProjectMutation,
  useStartProjectMutation,
  usePublishProjectMutation,
  useGetProjectQuery,
  useSubmitUserProjectMutation,
  useEditProjectMutation  
} = projectApiSlice;