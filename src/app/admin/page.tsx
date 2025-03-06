// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  Code2,
  Database,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  DollarSign,
  RefreshCw,
  PieChart,
  LineChart as LineChartIcon,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Zap,
  Loader2
} from 'lucide-react';
import { 
  useGetDashboardSummaryQuery, 
  useUpdateAnalyticsDataMutation 
} from '@/app/api/adminAnalyticsApiSlice';
import { toast } from 'sonner';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  positive = true, 
  prefix = "", 
  suffix = "", 
  loading = false
}) => {
  return (
    <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <h3 className="text-2xl font-bold">
                  {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                </h3>
              )}
            </div>
          </div>
          <div className="rounded-full p-2 bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        
        {change !== undefined && !loading && (
          <div className={`flex items-center mt-4 text-xs font-medium ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {positive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
            <span>{positive ? '+' : ''}{change}% from previous period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminDashboardPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch dashboard data
  const { data, isLoading, refetch } = useGetDashboardSummaryQuery();
  const [updateAnalyticsData] = useUpdateAnalyticsDataMutation();

  const router = useRouter();
  
  // Handle refresh button click
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await updateAnalyticsData().unwrap();
      await refetch();
      toast.success('Analytics data updated successfully');
    } catch (error) {
      console.error('Failed to update analytics data:', error);
      toast.error('Failed to update analytics data');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Extract data for charts
  const getChartData = () => {
    if (!data?.dashboardData?.trends) return { userTrend: [], projectTrend: [], revenueTrend: [] };
    
    // Format dates and add tooltips
    const userTrend = data.dashboardData.trends.userTrend.map(item => ({
      ...item,
      date: typeof item.date === 'string' ? item.date : format(new Date(item.date), 'MMM dd'),
      tooltip: `New Users: ${item.newUsers}, Active Users: ${item.activeUsers}`
    }));
    
    const projectTrend = data.dashboardData.trends.projectTrend.map(item => ({
      ...item,
      date: typeof item.date === 'string' ? item.date : format(new Date(item.date), 'MMM dd'),
      tooltip: `Generated: ${item.generated}, Published: ${item.published}`
    }));
    
    const revenueTrend = data.dashboardData.trends.revenueTrend.map(item => ({
      ...item,
      date: typeof item.date === 'string' ? item.date : format(new Date(item.date), 'MMM dd'),
      tooltip: `Revenue: $${item.revenue}, Subscriptions: ${item.proSubscriptions}`
    }));
    
    return { userTrend, projectTrend, revenueTrend };
  };
  
  const chartData = getChartData();
  
  // Generate pie chart data for user distribution
  const userDistributionData = data?.dashboardData ? [
    { name: 'Pro Users', value: data.dashboardData.userStats.proUsers },
    { name: 'Free Users', value: data.dashboardData.userStats.freeUsers }
  ] : [];
  
  // Generate project distribution data
  const projectDistributionData = data?.dashboardData ? [
    { name: 'Published', value: data.dashboardData.projectStats.publishedProjects },
    { name: 'Unpublished', value: data.dashboardData.projectStats.totalProjects - data.dashboardData.projectStats.publishedProjects }
  ] : [];
  
  // Generate collaboration distribution data
  const collaborationDistributionData = data?.dashboardData ? [
    { name: 'Accepted', value: data.dashboardData.collaborationStats.acceptedRequests },
    { name: 'Pending', value: data.dashboardData.collaborationStats.pendingRequests },
    { name: 'Rejected', value: data.dashboardData.collaborationStats.totalRequests - data.dashboardData.collaborationStats.acceptedRequests - data.dashboardData.collaborationStats.pendingRequests }
  ] : [];
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of platform metrics and analytics
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          className="gap-2"
          disabled={refreshing || isLoading}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Data
        </Button>
      </div>
      
      {/* Time Range Selector */}
      <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard 
            title="Total Users" 
            value={data?.dashboardData?.userStats.totalUsers}
            change={data?.dashboardData?.userStats.userGrowth?.monthly}
            icon={Users}
            positive={data?.dashboardData?.userStats.userGrowth?.monthly >= 0}
            loading={isLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard 
            title="Pro Subscription Rate" 
            value={data?.dashboardData?.userStats.proUserPercentage?.toFixed(1)}
            change={data?.dashboardData?.userStats.proUserGrowth}
            icon={DollarSign}
            positive={data?.dashboardData?.userStats.proUserGrowth >= 0}
            suffix="%"
            loading={isLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatCard 
            title="Projects Generated" 
            value={data?.dashboardData?.projectStats.totalProjects}
            change={data?.dashboardData?.projectStats.projectGrowth?.monthly}
            icon={Code2}
            positive={data?.dashboardData?.projectStats.projectGrowth?.monthly >= 0}
            loading={isLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <StatCard 
            title="Collaboration Requests" 
            value={data?.dashboardData?.collaborationStats.totalRequests}
            change={data?.dashboardData?.collaborationStats.acceptanceRate?.toFixed(1)}
            icon={Database}
            positive={true}
            suffix="% Accepted"
            loading={isLoading}
          />
        </motion.div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Growth
              </CardTitle>
              <CardDescription>
                New user registrations and active users over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.userTrend}>
                    <defs>
                      <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="newUsers" 
                      name="New Users"
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorNewUsers)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activeUsers" 
                      name="Active Users"
                      stroke="#82ca9d" 
                      fillOpacity={1} 
                      fill="url(#colorActiveUsers)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Projects Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Project Activity
              </CardTitle>
              <CardDescription>
                Generated and published projects over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.projectTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="generated" name="Generated" fill="#8884d8" />
                    <Bar dataKey="published" name="Published" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Revenue Trends
              </CardTitle>
              <CardDescription>
                Monthly revenue and pro subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue ($)" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="proSubscriptions" 
                      name="Pro Subscriptions" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Distribution Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Distribution Overview
              </CardTitle>
              <CardDescription>
                User plans, projects, and collaboration status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {/* User Distribution */}
                  <div>
                    <h4 className="text-sm font-medium text-center mb-2">Users</h4>
                    <ResponsiveContainer width="100%" height={150}>
                      <RechartsPieChart>
                        <Pie
                          data={userDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Project Distribution */}
                  <div>
                    <h4 className="text-sm font-medium text-center mb-2">Projects</h4>
                    <ResponsiveContainer width="100%" height={150}>
                      <RechartsPieChart>
                        <Pie
                          data={projectDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {projectDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Collaboration Distribution */}
                  <div>
                    <h4 className="text-sm font-medium text-center mb-2">Collaborations</h4>
                    <ResponsiveContainer width="100%" height={150}>
                      <RechartsPieChart>
                        <Pie
                          data={collaborationDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {collaborationDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feedback Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-20 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">Total Feedback</span>
                    <span className="font-medium">{data?.dashboardData?.feedbackStats.totalFeedback}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">Unprocessed</span>
                    <span className="font-medium">{data?.dashboardData?.feedbackStats.unprocessedFeedback}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">Processing Rate</span>
                    <span className="font-medium">{data?.dashboardData?.feedbackStats.processingRate?.toFixed(1)}%</span>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/admin/feedback')}
              >
                Manage Feedback
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-20 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">API Status</span>
                    </div>
                    <span className="text-xs font-medium text-green-500">Operational</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">AI Generation</span>
                    </div>
                    <span className="text-xs font-medium text-green-500">Optimal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Server Load</span>
                    </div>
                    <span className="text-xs font-medium text-green-500">Normal</span>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/admin/analytics')}
              >
                System Analytics
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-white dark:bg-black border-black/10 dark:border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/projects')}
              >
                <Code2 className="mr-2 h-4 w-4" />
                Review Projects
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/feedback')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Process Feedback
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;