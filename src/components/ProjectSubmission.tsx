import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Code2, Clock, Users, Layers, PlusCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { TechSelect } from '@/components/TechSelect';
import { ComplexitySlider } from './ComplexitySlider';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useSubmitUserProjectMutation } from '@/app/api/projectApiSlice';
import { useGetSubscriptionStatusQuery } from '@/app/api/paymentApiSlice';
import EnhancementConfirmationModal from '@/components/EnhancementConfirmationModal';

// Define the section types
type SectionType = 'features' | 'teamStructure' | 'learningOutcomes' | 'projectDetails';

// Define the role interface
interface Role {
  title: string;
  skills: string[];
  responsibilities: string[];
  filled?: boolean;
}

// Define project data structure
interface ProjectData {
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  status: string;
  teamSize: string;
  duration: string;
  complexity: number;
  features: {
    core: string[];
    additional: string[];
  };
  teamStructure: {
    roles: Role[];
  };
  learningOutcomes: string[];
  category?: string;
  useEnhancement?: boolean;
}
const ProjectSubmission = () => {
  const { isAuthenticated, login , user: userData} = useAuth();
  const [submitUserProject, { isLoading: isSubmitting }] = useSubmitUserProjectMutation();
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [enhancementModalOpen, setEnhancementModalOpen] = useState(false);
  
  // Get user profile and subscription data for enhancement limits

  const { data: subscriptionData } = useGetSubscriptionStatusQuery(undefined, {
    skip: !isAuthenticated
  });

  // Calculate enhancement limits
  const isPro = subscriptionData?.plan === 'pro';
  const enhancementsLeft = userData?.enhancementsLeft || 0;

  
  // Added state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    features: false,
    teamStructure: false,
    learningOutcomes: false,
    projectDetails: false
  });
  const [showAllSections, setShowAllSections] = useState(false);

  // Function to toggle a specific section
  const toggleSection = (section: SectionType): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  // Function to toggle all sections
  const toggleAllSections = () => {
    const newValue = !showAllSections;
    setShowAllSections(newValue);
    setExpandedSections({
      features: newValue,
      teamStructure: newValue,
      learningOutcomes: newValue,
      projectDetails: newValue
    });
  };
  
  const [projectData, setProjectData] = useState({
    title: "",
    subtitle: "",
    description: "",
    technologies: [],
    status: "",
    teamSize: "",
    duration: "",
    complexity: 50,
    features: {
      core: [""],
      additional: [""]
    },
    teamStructure: {
      roles: [
        {
          title: "",
          skills: [],
          responsibilities: [""]
        }
      ]
    },
    learningOutcomes: [""]
  });
  
  const handleInputChange = (field: keyof ProjectData, value: any): void => {
    if (!hasStartedTyping) setHasStartedTyping(true);
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleTechSelect = (techs: string[]): void => {
    handleInputChange('technologies', techs);
  };
  
  // Handle feature arrays
  const handleFeatureChange = (index: number, value: string, type: 'core' | 'additional'): void => {
    const updatedFeatures = { ...projectData.features };
    updatedFeatures[type][index] = value;
    handleInputChange('features', updatedFeatures);
  };
  
  const addFeature = (type: 'core' | 'additional'): void => {
    const updatedFeatures = { ...projectData.features };
    updatedFeatures[type] = [...updatedFeatures[type], ""];
    handleInputChange('features', updatedFeatures);
  };
  
  const removeFeature = (index: number, type: 'core' | 'additional'): void => {
    const updatedFeatures = { ...projectData.features };
    updatedFeatures[type] = updatedFeatures[type].filter((_, i: number) => i !== index);
    if (updatedFeatures[type].length === 0) {
      updatedFeatures[type] = [""];
    }
    handleInputChange('features', updatedFeatures);
  };
  
  // Handle roles in team structure
  const handleRoleChange = (index: number, field: keyof Role, value: any): void => {
    const updatedRoles = [...projectData.teamStructure.roles];
    updatedRoles[index] = { ...updatedRoles[index], [field]: value };
    handleInputChange('teamStructure', { roles: updatedRoles });
  };
  
  const addRole = () => {
    const updatedRoles = [
      ...projectData.teamStructure.roles,
      { title: "", skills: [], responsibilities: [""] }
    ];
    handleInputChange('teamStructure', { roles: updatedRoles });
  };
  
  const removeRole = (index: number): void => {
    if (projectData.teamStructure.roles.length <= 1) return;
    const updatedRoles = projectData.teamStructure.roles.filter((_, i: number) => i !== index);
    handleInputChange('teamStructure', { roles: updatedRoles });
  };
  
  // Handle responsibilities within a role
  const handleResponsibilityChange = (roleIndex: number, respIndex: number, value: string): void => {
    const updatedRoles = [...projectData.teamStructure.roles];
    const roleResponsibilities = [...updatedRoles[roleIndex].responsibilities];
    roleResponsibilities[respIndex] = value;
    updatedRoles[roleIndex].responsibilities = roleResponsibilities;
    handleInputChange('teamStructure', { roles: updatedRoles });
  };
  
  const addResponsibility = (roleIndex: number): void => {
    const updatedRoles = [...projectData.teamStructure.roles];
    updatedRoles[roleIndex].responsibilities = [
      ...updatedRoles[roleIndex].responsibilities, 
      ""
    ];
    handleInputChange('teamStructure', { roles: updatedRoles });
  };
  
  const removeResponsibility = (roleIndex: number, respIndex: number): void => {
    const updatedRoles = [...projectData.teamStructure.roles];
    if (updatedRoles[roleIndex].responsibilities.length <= 1) return;
    updatedRoles[roleIndex].responsibilities = updatedRoles[roleIndex].responsibilities.filter((_, i: number) => i !== respIndex);
    handleInputChange('teamStructure', { roles: updatedRoles });
  };
  
  // Handle learning outcomes
  const handleOutcomeChange = (index: number, value: string): void => {
    const updatedOutcomes = [...projectData.learningOutcomes];
    updatedOutcomes[index] = value;
    handleInputChange('learningOutcomes', updatedOutcomes);
  };
  const addOutcome = () => {
    handleInputChange('learningOutcomes', [...projectData.learningOutcomes, ""]);
  };
  
  const removeOutcome = (index: number): void => {
    if (projectData.learningOutcomes.length <= 1) return;
    const updatedOutcomes = projectData.learningOutcomes.filter((_, i: number) => i !== index);
    handleInputChange('learningOutcomes', updatedOutcomes);
  };

  // Handle form validation and open the enhancement modal
  const handleSubmit = async () => {
    // Check authentication
    if (!isAuthenticated) {
      try {
        await login();
        toast.info('Please try submitting your project after logging in');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Please login to submit a project');
      }
      return;
    }

    // Validate required fields
    if (!projectData.title) {
      toast.error('Project title is required');
      return;
    }

    if (!projectData.description) {
      toast.error('Project description is required');
      return;
    }

    if (projectData.technologies.length === 0) {
      toast.error('At least one technology is required');
      return;
    }

    if (!projectData.teamSize) {
      toast.error('Team size in Project Details is required');
      return;
    }

    if (!projectData.duration) {
      toast.error('Project duration in Project Details is required');
      return;
    }

    const hasEmptyRoleTitle = projectData.teamStructure.roles.some(role => !role.title.trim());
    if (hasEmptyRoleTitle) {
      toast.error('Team roles in Team Structure is required');
      return;
    }

    // Open the enhancement confirmation modal
    setEnhancementModalOpen(true);
  };

  // Handle the actual submission with or without enhancement
  const handleProjectSubmission = async (useEnhancement:boolean) => {
    // Format data for API request
    const formattedData = {
      title: projectData.title,
      subtitle: projectData.subtitle,
      description: projectData.description,
      technologies: projectData.technologies,
      status: projectData.status,
      teamSize: projectData.teamSize,
      duration: projectData.duration,
      complexity: projectData.complexity,
      features: {
        core: projectData.features.core.filter(f => f.trim()),
        additional: projectData.features.additional.filter(f => f.trim())
      },
      teamStructure: {
        roles: projectData.teamStructure.roles.map(role => ({
          title: role.title,
          skills: role.skills,
          responsibilities: role.responsibilities.filter(r => r.trim())
        }))
      },
      learningOutcomes: projectData.learningOutcomes.filter(o => o.trim()),
      category: 'web', // Default category
      useEnhancement: useEnhancement // This flag tells the backend whether to use AI enhancement
    };

    console.log('Submitting project data:', formattedData);

    try {
      const result = await submitUserProject(formattedData).unwrap();
      
      // Customize the success message based on whether enhancement was used
      if (result.wasEnhanced) {
        toast.success('Project submitted and enhanced with AI successfully!');
      } else {
        toast.success('Project submitted successfully!');
      }
      
      // Reset form
      setProjectData({
        title: "",
        subtitle: "",
        description: "",
        technologies: [],
        status: "",
        teamSize: "",
        duration: "",
        complexity: 50,
        features: {
          core: [""],
          additional: [""]
        },
        teamStructure: {
          roles: [
            {
              title: "",
              skills: [],
              responsibilities: [""]
            }
          ]
        },
        learningOutcomes: [""]
      });
      setHasStartedTyping(false);
    } catch (error:any) {
      console.error('Submit project error:', error);
      toast.error(error.data?.message || 'Failed to submit project');
    }
  };

  // Helper function to format the text with basic markdown
  const formatDescription = (text: string): React.ReactNode => {
    if (!text) return '';
    
    // Split into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph:string, index:number) => {
      // Check if the paragraph starts with "- " or "* " for bullet points
      if (paragraph.trim().match(/^[-*]\s/)) {
        return (
          <li key={index} className="ml-6 text-muted-foreground">
            {paragraph.trim().substring(2)}
          </li>
        );
      }
      // Regular paragraph
      return (
        <p key={index} className="text-muted-foreground mb-4">
          {paragraph}
        </p>
      );
    });
  };

  // Helper function to format duration and team size
  const formatMetric = (value: string, type: 'duration' | 'teamSize'): string => {
    const metrics: {
      duration: Record<string, string>;
      teamSize: Record<string, string>;
    } = {
      duration: {
        'small': '1-2 weeks',
        'medium': '1-2 months',
        'large': '3+ months'
      },
      teamSize: {
        'solo': 'Solo developer',
        'small': '2-3 members',
        'medium': '4-6 members'
      }
    };
    
    return metrics[type][value] || value;
  };

  return (
    <section className="container px-4 mx-auto pt-8 pb-8">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent font-orbitron"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Have a Project Idea?
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Share your existing project idea and find collaborators to help bring it to life.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <motion.div className="lg:col-span-2" layout>
          <div className="group relative">
            {/* Background shadow element */}
            <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
            
            {/* Main card */}
            <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Share your project information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Project Information - Always visible */}
                <div className="space-y-2">
                  <Label>Project Title *</Label>
                  <Input 
                    placeholder="Enter project title"
                    value={projectData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Subtitle</Label>
                  <Input 
                    placeholder="A brief one-liner about your project"
                    value={projectData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Description *</Label>
                  <div className="space-y-2">
                    <textarea 
                      placeholder="Describe your project idea...
- Use new lines for paragraphs
- Start lines with - or * for bullet points"
                      className="w-full min-h-32 p-3 rounded-md border bg-background text-sm"
                      value={projectData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use new lines for paragraphs. Start lines with - or * for bullet points.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Technologies *</Label>
                  <TechSelect 
                    onSelect={handleTechSelect}
                    defaultValue={projectData.technologies} 
                  />
                </div>

               
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={toggleAllSections}
                    className="flex items-center gap-1 w-full"
                  >
                    {showAllSections ? 
                      <><ChevronUp className="h-4 w-4" /> Hide All Additional Fields</> : 
                      <><ChevronDown className="h-4 w-4" /> Show All Additional Fields</>
                    }
                  </Button>
                </div> 

                {/* Collapsible Sections */}
                <CollapsibleSection 
                  title="Project Details" 
                  isOpen={expandedSections.projectDetails}
                  toggle={() => toggleSection('projectDetails')}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Project Status</Label>
                      <Select 
                        value={projectData.status} 
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning Phase</SelectItem>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Team Size</Label>
                        <Select 
                          value={projectData.teamSize} 
                          onValueChange={(value) => handleInputChange('teamSize', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solo">Solo Project</SelectItem>
                            <SelectItem value="small">2-3 Members</SelectItem>
                            <SelectItem value="medium">4-6 Members</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Select 
                          value={projectData.duration} 
                          onValueChange={(value) => handleInputChange('duration', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">1-2 weeks</SelectItem>
                            <SelectItem value="medium">1-2 months</SelectItem>
                            <SelectItem value="large">3+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <ComplexitySlider
                        defaultValue={projectData.complexity}
                        onChange={(value) => handleInputChange('complexity', value)}
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection 
                  title="Team Structure" 
                  isOpen={expandedSections.teamStructure}
                  toggle={() => toggleSection('teamStructure')}
                >
                  <div className="space-y-4">
                    {projectData.teamStructure.roles.map((role, roleIndex) => (
                      <div key={`role-${roleIndex}`} className="space-y-3 p-3 border rounded-md">
                        <div className="flex items-center justify-between">
                          <Label>Role {roleIndex + 1}</Label>
                          {projectData.teamStructure.roles.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              type="button"
                              onClick={() => removeRole(roleIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <Input 
                          placeholder="Role title (e.g., Frontend Developer)"
                          value={role.title}
                          onChange={(e) => handleRoleChange(roleIndex, 'title', e.target.value)}
                        />
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Required Skills</Label>
                          <TechSelect 
                            onSelect={(techs) => handleRoleChange(roleIndex, 'skills', techs)}
                            defaultValue={role.skills}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Responsibilities</Label>
                          {role.responsibilities.map((resp, respIndex) => (
                            <div key={`resp-${roleIndex}-${respIndex}`} className="flex items-center gap-2">
                              <Input 
                                placeholder="E.g., Build responsive UI components"
                                value={resp}
                                onChange={(e) => handleResponsibilityChange(roleIndex, respIndex, e.target.value)}
                              />
                              {role.responsibilities.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  type="button"
                                  onClick={() => removeResponsibility(roleIndex, respIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            type="button"
                            onClick={() => addResponsibility(roleIndex)}
                            className="flex items-center gap-1"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add Responsibility
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={addRole}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Role
                    </Button>
                  </div>
                </CollapsibleSection>


                <CollapsibleSection 
                  title="Features" 
                  isOpen={expandedSections.features}
                  toggle={() => toggleSection('features')}
                >
                  <div className="space-y-4">
                    <Label>Core Features</Label>
                    {projectData.features.core.map((feature, index) => (
                      <div key={`core-${index}`} className="flex items-center gap-2">
                        <Input 
                          placeholder="E.g., User authentication"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value, 'core')}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          type="button"
                          onClick={() => removeFeature(index, 'core')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => addFeature('core')}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Core Feature
                    </Button>
                  </div>

                  <div className="space-y-4 mt-4">
                    <Label>Additional Features</Label>
                    {projectData.features.additional.map((feature, index) => (
                      <div key={`additional-${index}`} className="flex items-center gap-2">
                        <Input 
                          placeholder="E.g., Advanced reporting"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value, 'additional')}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          type="button"
                          onClick={() => removeFeature(index, 'additional')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => addFeature('additional')}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Additional Feature
                    </Button>
                  </div>
                </CollapsibleSection>

                

                <CollapsibleSection 
                  title="Learning Outcomes" 
                  isOpen={expandedSections.learningOutcomes}
                  toggle={() => toggleSection('learningOutcomes')}
                >
                  <div className="space-y-4">
                    {projectData.learningOutcomes.map((outcome, index) => (
                      <div key={`outcome-${index}`} className="flex items-center gap-2">
                        <Input 
                          placeholder="E.g., Understanding of state management"
                          value={outcome}
                          onChange={(e) => handleOutcomeChange(index, e.target.value)}
                        />
                        {projectData.learningOutcomes.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            type="button"
                            onClick={() => removeOutcome(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={addOutcome}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Learning Outcome
                    </Button>
                  </div>
                </CollapsibleSection>

              
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Code2 className="h-4 w-4" />
                      Submit Project
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>

        {hasStartedTyping && (
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="group relative">
              {/* Background shadow element */}
              <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
              
              {/* Main card */}
              <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                <CardHeader>
                  <CardTitle>{projectData.title || "Project Title"}</CardTitle>
                  <CardDescription>{projectData.subtitle || "Project Preview"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {projectData.duration ? formatMetric(projectData.duration, 'duration') : 'Duration'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {projectData.teamSize ? formatMetric(projectData.teamSize, 'teamSize') : 'Team Size'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium text-white
                        bg-gradient-to-r ${projectData.complexity <= 33 
                          ? 'from-emerald-500 to-emerald-700'
                          : projectData.complexity <= 66 
                            ? 'from-blue-500 to-blue-700'
                            : 'from-purple-500 to-purple-700'
                        }
                      `}>
                        {projectData.complexity <= 33 
                          ? "Beginner" 
                          : projectData.complexity <= 66 
                            ? "Intermediate" 
                            : "Advanced"
                        }
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Required Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {projectData.technologies.length > 0 ? (
                        projectData.technologies.map(tech => (
                          <Badge key={tech}>{tech}</Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No technologies selected</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Project Description</h3>
                    <div className="space-y-2">
                      {projectData.description ? 
                        formatDescription(projectData.description) : 
                        <p className="text-muted-foreground">Add a description to see it here...</p>
                      }
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Project Features</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Core Features</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {projectData.features.core.some(f => f.trim()) ? (
                            projectData.features.core
                              .filter(feature => feature.trim())
                              .map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))
                          ) : (
                            <li>Add core features to see them here</li>
                          )}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Additional Features</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {projectData.features.additional.some(f => f.trim()) ? (
                            projectData.features.additional
                              .filter(feature => feature.trim())
                              .map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))
                          ) : (
                            <li>Add additional features to see them here</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Team Structure */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Team Structure</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Required Roles</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {projectData.teamStructure.roles.some(r => r.title.trim()) ? (
                            projectData.teamStructure.roles
                              .filter(role => role.title.trim())
                              .map((role, index) => (
                                <li key={index}>{role.title}</li>
                              ))
                          ) : (
                            <li>Add roles to see them here</li>
                          )}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Role Responsibilities</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {projectData.teamStructure.roles.some(r => r.responsibilities.some(resp => resp.trim())) ? (
                            projectData.teamStructure.roles
                              .filter(role => role.responsibilities.some(resp => resp.trim()))
                              .map((role, index) => (
                                <li key={index}>{role.title}: {role.responsibilities.filter(r => r.trim())[0]}</li>
                              ))
                          ) : (
                            <li>Add responsibilities to see them here</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Learning Outcomes</h3>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {projectData.learningOutcomes.some(o => o.trim()) ? (
                        projectData.learningOutcomes
                          .filter(outcome => outcome.trim())
                          .map((outcome, index) => (
                            <li key={index}>{outcome}</li>
                          ))
                      ) : (
                        <li>Add learning outcomes to see them here</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Project Status</h3>
                    <Badge variant="outline">
                      {projectData.status || "Not specified"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* AI Enhancement Modal */}
      <EnhancementConfirmationModal
        isOpen={enhancementModalOpen}
        onClose={() => setEnhancementModalOpen(false)}
        onConfirm={handleProjectSubmission}
        enhancementsLeft={enhancementsLeft}
        isPro={isPro}
      />
    </section>
  );
};
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

const CollapsibleSection = ({ title, children, isOpen, toggle }: CollapsibleSectionProps) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <button 
        onClick={toggle} 
        className="w-full p-3 text-left flex justify-between items-center bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="p-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProjectSubmission;