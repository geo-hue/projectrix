// src/app/api/adminAnalyticsApiSlice.ts
import { apiSlice } from './apiSlice';

export interface DashboardSummary {
  userStats: {
    totalUsers: number;
    newUsersToday: number;
    proUsers: number;
    freeUsers: number;
    userGrowth: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    proUserPercentage: number;
    proUserGrowth: number;
  };
  projectStats: {
    totalProjects: number;
    publishedProjects: number;
    projectsGeneratedToday: number;
    projectGrowth: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    publishRate: number;
  };
  collaborationStats: {
    totalRequests: number;
    pendingRequests: number;
    acceptedRequests: number;
    acceptanceRate: number;
  };
  feedbackStats: {
    totalFeedback: number;
    unprocessedFeedback: number;
    processingRate: number;
  };
  trends: {
    userTrend: Array<{
      date: string;
      newUsers: number;
      activeUsers: number;
    }>;
    projectTrend: Array<{
      date: string;
      generated: number;
      published: number;
    }>;
    revenueTrend: Array<{
      date: string;
      revenue: number;
      proSubscriptions: number;
    }>;
  };
}

export interface UserMetrics {
  registrationTrend: Array<{
    _id: string; // date in YYYY-MM-DD format
    count: number;
  }>;
  planDistribution: Array<{
    _id: string; // plan type
    count: number;
  }>;
  techDistribution: Array<{
    _id: string; // technology name
    count: number;
  }>;
  roleDistribution: Record<string, number>;
  activeUserTrends: Array<{
    timestamp: string;
    activeUsers: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  }>;
  retentionData: Array<{
    timestamp: string;
    userRetention: {
      day7: number;
      day30: number;
      day90: number;
    };
  }>;
}

export interface ProjectMetrics {
  projectGenerationTrend: Array<{
    _id: string; // date in YYYY-MM-DD format
    count: number;
  }>;
  publishRateTrend: Array<{
    _id: string; // date in YYYY-MM-DD format
    total: number;
    published: number;
    publishRate: number;
  }>;
  categoryDistribution: Array<{
    _id: string; // category name
    count: number;
  }>;
  techPopularity: Array<{
    _id: string; // technology name
    count: number;
  }>;
  complexityByCategory: Array<{
    _id: string; // category name
    avgComplexity: number;
  }>;
  teamSizeDistribution: Array<{
    _id: string; // team size type
    count: number;
  }>;
  durationDistribution: Array<{
    _id: string; // duration type
    count: number;
  }>;
}

export interface CollaborationMetrics {
  collaborationTrend: Array<{
    _id: string; // date in YYYY-MM-DD format
    total: number;
    accepted: number;
    rejected: number;
    pending: number;
  }>;
  acceptanceByCategory: Array<{
    category: string;
    total: number;
    accepted: number;
    acceptanceRate: number;
  }>;
  popularRoles: Array<{
    role: string;
    count: number;
    acceptedCount: number;
    acceptanceRate: number;
  }>;
}

export interface RevenueMetrics {
  currentRevenue: {
    monthly: number;
    total: number;
    arpu: number;
    estimatedLtv: number;
    churnRate: number;
    growthRate: number;
  };
  revenueTrends: Array<{
    timestamp: string;
    monthlyRevenue: number;
  }>;
  forecastedRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  revenueByCountry: Record<string, number>;
}

export interface SystemMetrics {
  current: {
    timestamp: string;
    apiResponseTimes: {
      avg: number;
      p95: number;
      p99: number;
    };
    errorRates: {
      total: number;
      byEndpoint: Record<string, number>;
    };
    serverLoad: {
      cpu: number;
      memory: number;
      diskUsage: number;
    };
    aiGenerationMetrics: {
      avgResponseTime: number;
      successRate: number;
      errorRate: number;
      tokensUsed: number;
    };
  };
  trends: Array<{
    timestamp: string;
    apiResponseTimes: {
      avg: number;
      p95: number;
      p99: number;
    };
    errorRates: {
      total: number;
    };
    serverLoad: {
      cpu: number;
      memory: number;
      diskUsage: number;
    };
    aiGenerationMetrics: {
      avgResponseTime: number;
      successRate: number;
      errorRate: number;
      tokensUsed: number;
    };
  }>;
}

export const adminAnalyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard summary
    getDashboardSummary: builder.query<{ success: boolean; dashboardData: DashboardSummary }, void>({
      query: () => ({
        url: '/admin/analytics/dashboard',
        method: 'GET',
      }),
      providesTags: ['AdminDashboard']
    }),
    
    // User metrics
    getUserMetrics: builder.query<{ success: boolean; metrics: UserMetrics }, void>({
      query: () => ({
        url: '/admin/analytics/users',
        method: 'GET',
      }),
      providesTags: ['UserMetrics']
    }),
    
    // Project metrics
    getProjectMetrics: builder.query<{ success: boolean; metrics: ProjectMetrics }, void>({
      query: () => ({
        url: '/admin/analytics/projects',
        method: 'GET',
      }),
      providesTags: ['ProjectMetrics']
    }),
    
    // Collaboration metrics
    getCollaborationMetrics: builder.query<{ success: boolean; metrics: CollaborationMetrics }, void>({
      query: () => ({
        url: '/admin/analytics/collaborations',
        method: 'GET',
      }),
      providesTags: ['CollaborationMetrics']
    }),
    
    // Revenue metrics
    getRevenueMetrics: builder.query<{ success: boolean; metrics: RevenueMetrics }, void>({
      query: () => ({
        url: '/admin/analytics/revenue',
        method: 'GET',
      }),
      providesTags: ['RevenueMetrics']
    }),
    
    // System metrics
    getSystemMetrics: builder.query<{ success: boolean; metrics: SystemMetrics }, void>({
      query: () => ({
        url: '/admin/analytics/system',
        method: 'GET',
      }),
      providesTags: ['SystemMetrics']
    }),
    
    // Update analytics data (manual trigger)
    updateAnalyticsData: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/admin/analytics/update',
        method: 'POST',
      }),
      invalidatesTags: [
        'AdminDashboard',
        'UserMetrics',
        'ProjectMetrics',
        'CollaborationMetrics',
        'RevenueMetrics',
        'SystemMetrics'
      ]
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetUserMetricsQuery,
  useGetProjectMetricsQuery,
  useGetCollaborationMetricsQuery,
  useGetRevenueMetricsQuery,
  useGetSystemMetricsQuery,
  useUpdateAnalyticsDataMutation
} = adminAnalyticsApiSlice;