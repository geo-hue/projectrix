'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  Trash2,
  Loader2,
  AlertCircle,
  Shield,
  ShieldOff,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserPlanMutation, useUpdateUserRoleMutation } from '@/app/api/adminUsersApiSlice';


const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Selected user for detail view or actions
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // API calls
  const queryParams = {
    search: searchTerm || undefined,
    plan: filterPlan !== 'all' ? filterPlan : undefined,
    role: filterRole !== 'all' ? filterRole : undefined,
    sort: sortBy,
    page: currentPage,
    limit: pageSize
  };
  
  const { 
    data: userData, 
    isLoading, 
    error, 
    refetch 
  } = useGetUsersQuery(queryParams);
  
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [updateUserPlan] = useUpdateUserPlanMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  
  // Handle search
  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    // The query is already using the searchTerm state
  };
  
  // Handle filter and sort changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filterPlan, filterRole, sortBy]);
  
  // Handle user role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole}`);
      refetch();
    } catch (err) {
      console.error('Failed to update user role:', err);
      toast.error(err.data?.message || 'Failed to update user role');
    }
  };
  
  // Handle user plan update
  const handlePlanUpdate = async (userId, newPlan) => {
    try {
      await updateUserPlan({ userId, plan: newPlan }).unwrap();
      toast.success(`User plan updated to ${newPlan}`);
      refetch();
    } catch (err) {
      console.error('Failed to update user plan:', err);
      toast.error(err.data?.message || 'Failed to update user plan');
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser._id).unwrap();
      toast.success('User deleted successfully');
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error(err.data?.message || 'Failed to delete user');
    }
  };
  
  // Refresh data
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Users Management</h1>
          <p className="text-muted-foreground">
            View and manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            className="gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="grid gap-4 md:grid-cols-6">
        <form onSubmit={handleSearch} className="md:col-span-2 flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterPlan} onValueChange={setFilterPlan}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-muted-foreground" />
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => setPageSize(parseInt(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Users Table */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardHeader className="pb-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            All Users
          </CardTitle>
          <CardDescription>
            {userData?.totalUsers || 0} total users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full py-24 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="w-full py-24 flex flex-col items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
              <p className="text-red-500 font-medium">Failed to load users</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleRefresh}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData?.users && userData.users.length > 0 ? (
                      userData.users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage 
                                  src={user.avatar} 
                                  alt={user.name}
                                  onError={(e) => {
                                    e.currentTarget.src = `https://avatar.vercel.sh/${user.username}`;
                                  }}
                                />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">@{user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge className={user.role === 'admin' ? 'bg-blue-500' : 'bg-slate-500'}>
                                {user.role}
                              </Badge>
                              <Badge className={user.plan === 'pro' ? 'bg-amber-500' : 'bg-slate-500'}>
                                {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs space-y-1">
                              <div>Projects: {user.projectsGenerated}</div>
                              <div>Collaborations: {user.projectsCollaborated}</div>
                              <div>Published: {user.publishedProjectsCount}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.createdAt), 'PPP')}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedUser(user);
                                  setIsUserDetailOpen(true);
                                }}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleRoleUpdate(
                                    user._id, 
                                    user.role === 'admin' ? 'user' : 'admin'
                                  )}
                                >
                                  {user.role === 'admin' ? (
                                    <>
                                      <ShieldOff className="mr-2 h-4 w-4" />
                                      <span>Remove Admin</span>
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="mr-2 h-4 w-4" />
                                      <span>Make Admin</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handlePlanUpdate(
                                    user._id, 
                                    user.plan === 'pro' ? 'free' : 'pro'
                                  )}
                                >
                                  {user.plan === 'pro' ? (
                                    <>
                                      <X className="mr-2 h-4 w-4" />
                                      <span>Remove Pro Plan</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="mr-2 h-4 w-4" />
                                      <span>Upgrade to Pro</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete User</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {userData?.totalPages && userData.totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1} 
                        />
                      </PaginationItem>
                      
                      {[...Array(userData.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Only show first, last, and pages around current
                        if (
                          pageNum === 1 || 
                          pageNum === userData.totalPages || 
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                isActive={pageNum === currentPage}
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          (pageNum === 2 && currentPage > 3) ||
                          (pageNum === userData.totalPages - 1 && currentPage < userData.totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, userData.totalPages))}
                          disabled={currentPage === userData.totalPages} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* User Detail Dialog */}
      {selectedUser && (
        <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about this user
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name}
                    onError={(e) => {
                      e.currentTarget.src = `https://avatar.vercel.sh/${selectedUser.username}`;
                    }}
                  />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={selectedUser.role === 'admin' ? 'bg-blue-500' : 'bg-slate-500'}>
                      {selectedUser.role}
                    </Badge>
                    <Badge className={selectedUser.plan === 'pro' ? 'bg-amber-500' : 'bg-slate-500'}>
                      {selectedUser.plan}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p className="text-sm"><span className="font-medium">GitHub:</span> {selectedUser.githubId}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Account Info</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Joined:</span> {format(new Date(selectedUser.createdAt), 'PPP')}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Project Ideas Left:</span> {selectedUser.projectIdeasLeft}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Collaboration Requests:</span> {selectedUser.collaborationRequestsLeft}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Activity</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{selectedUser.projectsGenerated}</p>
                    <p className="text-xs text-muted-foreground">Projects Generated</p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{selectedUser.projectsCollaborated}</p>
                    <p className="text-xs text-muted-foreground">Collaborations</p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{selectedUser.publishedProjectsCount}</p>
                    <p className="text-xs text-muted-foreground">Published</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills && selectedUser.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                  {(!selectedUser.skills || selectedUser.skills.length === 0) && (
                    <p className="text-sm text-muted-foreground">No skills added</p>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUserDetailOpen(false)}
              >
                Close
              </Button>
              <Button
                variant={selectedUser.plan === 'pro' ? 'destructive' : 'default'}
                onClick={() => {
                  handlePlanUpdate(
                    selectedUser._id, 
                    selectedUser.plan === 'pro' ? 'free' : 'pro'
                  );
                  setIsUserDetailOpen(false);
                }}
              >
                {selectedUser.plan === 'pro' ? 'Remove Pro Plan' : 'Upgrade to Pro'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {selectedUser && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center gap-4 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={selectedUser.avatar} 
                  alt={selectedUser.name}
                  onError={(e) => {
                    e.currentTarget.src = `https://avatar.vercel.sh/${selectedUser.username}`;
                  }}
                />
                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:justify-start">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminUsersPage;