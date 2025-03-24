'use client';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Filter,
  Sparkles,
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import TechBackground from '@/components/TechBackground';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';


// Import the API hooks
import { 
  useGetPublishedProjectsQuery, 
  useGetAvailableTechnologiesQuery,
  useGetAvailableRolesQuery 
} from '@/app/api/publishedProjectsApiSlice';
import ProfileCompletionBanner from '@/components/ProfileCompletionBanner';

const ProjectIdeasPage = () => {
  const router = useRouter();
  
  // State for filters
  const [filterTech, setFilterTech] = useState('all');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12;

  // Create derived query parameters based on filters
  const queryParams = {
    ...(filterTech !== 'all' && { technology: filterTech }),
    ...(filterComplexity !== 'all' && { complexity: filterComplexity.toLowerCase() }),
    ...(filterRole !== 'all' && { role: filterRole }),
    page: currentPage,
    limit: projectsPerPage
  };
  
  // Use the API hooks with the filters
  const { 
    data: projectsData, 
    isLoading: projectsLoading, 
    error: projectsError
  } = useGetPublishedProjectsQuery(queryParams);

  const { 
    data: technologiesData, 
    isLoading: technologiesLoading 
  } = useGetAvailableTechnologiesQuery();

  const { 
    data: rolesData, 
    isLoading: rolesLoading 
  } = useGetAvailableRolesQuery();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterTech, filterComplexity, filterRole]);

  const sortedProjects = projectsData?.projects ? [...projectsData.projects].sort((a, b) => {
    // Count unfilled roles in project A
    const unfilledRolesA = a.teamStructure?.roles?.filter(role => !role.filled)?.length || 0;
    
    // Count unfilled roles in project B
    const unfilledRolesB = b.teamStructure?.roles?.filter(role => !role.filled)?.length || 0;
    
    // Sort by number of unfilled roles (descending)
    return unfilledRolesB - unfilledRolesA;
  }) : [];

  
  //  custom CSS for the blue background patterns and effects
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .tech-grid-bg {
        background-image: linear-gradient(to right, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      .blue-glow {
        background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Calculate if any data is loading
  const isLoading = projectsLoading || technologiesLoading || rolesLoading;

  // Handle pagination
  const handlePageChange = (newPage:any) => {
    // Make sure we don't go below page 1 or above the total pages
    const totalPages = projectsData?.totalPages || 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of projects section
      document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background tech-grid-bg relative overflow-hidden">
        <Header />
        <TechBackground />
        
        {/* Subtle blue glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blue-glow -z-10 opacity-60"></div>
        
        <main className="flex-grow relative z-10">
          <div className="container px-4 mx-auto py-8">
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 font-orbitron mt-20 md:mt-20 relative inline-block">
                  <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                    Available
                  </span>{" "}
                  <span className="text-black dark:text-white">
                    Projects
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Browse through available projects and find opportunities to collaborate with other developers.
                </p>
              </div>

              {/* Filters Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/50 dark:bg-black/50 p-4 rounded-lg backdrop-blur-sm border border-black/10 dark:border-white/10"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4 flex-wrap">
                    <div>
                      <label className="text-sm font-medium block mb-1">Technology</label>
                      <Select value={filterTech} onValueChange={setFilterTech}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="All Technologies" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Technologies</SelectItem>
                          {technologiesData?.technologies?.map((tech, idx) => (
                            <SelectItem key={idx} value={tech}>{tech}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Complexity</label>
                      <Select value={filterComplexity} onValueChange={setFilterComplexity}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="All Levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Available Role</label>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          {rolesData?.roles?.map((role, idx) => (
                            <SelectItem key={idx} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-between sm:justify-end">
                    <Button 
                      variant="outline"
                      className="gap-2 flex-1 sm:flex-none"
                      onClick={() => {
                        setFilterTech('all');
                        setFilterComplexity('all');
                        setFilterRole('all');
                      }}
                    >
                      <Filter className="h-4 w-4" />
                      Reset Filters
                    </Button>
                    <Button 
                      className="gap-2 flex-1 sm:flex-none bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                      onClick={() => router.push('/generate')}
                    >
                      <Sparkles className="h-4 w-4" />
                      Create Your Own Project
                    </Button>
                  </div>
                </div>
              </motion.div>

              <ProfileCompletionBanner />

              {/* Projects Grid */}
              <div id="projects-section">
                {isLoading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: projectsPerPage }).map((_, i) => (
                      <div key={i} className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg transform rotate-2 animate-pulse"></div>
                        <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-lg"></div>
                        <div className="relative h-[550px] rounded-lg bg-white/80 dark:bg-black/80 animate-pulse border border-black/20 dark:border-white/20"></div>
                      </div>
                    ))}
                  </div>
                ) : projectsError ? (
                  <div className="text-center py-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-10 rounded-lg border border-black/10 dark:border-white/10 inline-block"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-red-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Error loading projects</h3>
                      <p className="text-muted-foreground mb-6">There was a problem loading the projects. Please try again later.</p>
                      <Button 
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.location.reload()}
                      >
                        <Loader2 className="h-4 w-4" />
                        Retry
                      </Button>
                    </motion.div>
                  </div>
                ) : projectsData?.projects && projectsData.projects.length > 0 ? (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProjects.map((project) => (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <ProjectCard project={project} height={400} />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {projectsData.totalPages > 1 && (
                      <div className="mt-12 flex justify-center">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-10 w-10"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <div className="flex items-center gap-2">
                            {Array.from({ length: projectsData.totalPages }, (_, i) => i + 1)
                              .filter(page => {
                                // Show current page, first page, last page, and pages adjacent to current
                                return (
                                  page === 1 ||
                                  page === projectsData.totalPages ||
                                  Math.abs(page - currentPage) <= 1
                                );
                              })
                              .map((page, index, array) => {
                                // Add ellipsis if there are gaps in the sequence
                                const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                                
                                return (
                                  <React.Fragment key={page}>
                                    {showEllipsisBefore && (
                                      <span className="px-2 text-muted-foreground">...</span>
                                    )}
                                    <Button
                                      variant={currentPage === page ? "default" : "outline"}
                                      onClick={() => handlePageChange(page)}
                                      className={`h-10 w-10 ${
                                        currentPage === page
                                          ? "bg-primary text-primary-foreground"
                                          : ""
                                      }`}
                                    >
                                      {page}
                                    </Button>
                                  </React.Fragment>
                                );
                              })}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === projectsData.totalPages}
                            className="h-10 w-10"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-10 rounded-lg border border-black/10 dark:border-white/10 inline-block"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-primary/70" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No matching projects found</h3>
                      <p className="text-muted-foreground mb-6">Try adjusting your filters or create your own project.</p>
                      <Button 
                        className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                        onClick={() => router.push('/generate')}
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate New Project
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProjectIdeasPage;