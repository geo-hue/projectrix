'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Sparkles, 
  RefreshCcw,
  Bookmark,
  Share2,
  Clock,
  Users,
  Layers,
  Code2,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Footer from '@/components/Footer';
import ProjectSubmission from '@/components/ProjectSubmission';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import { TechSelect } from '@/components/TechSelect';
import { ComplexitySlider } from '@/components/ComplexitySlider';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useGenerateProjectMutation,
  useGenerateAnotherMutation,
  useSaveProjectMutation,
  useStartProjectMutation
} from '../api/projectApiSlice';
import { Project } from '../types/projectTypes';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function GeneratePage() {
  // State and hooks
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuth();
  
  // Replace Redux with RTK Query mutations
  const [generateProject, { isLoading: generating }] = useGenerateProjectMutation();
  const [generateAnother] = useGenerateAnotherMutation();
  const [saveProject] = useSaveProjectMutation();
  const [startProject] = useStartProjectMutation();

  // Current project state (local)
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Form state
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [complexityLevel, setComplexityLevel] = useState(50);
  const [duration, setDuration] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [category, setCategory] = useState('');
  const [projectTheme, setProjectTheme] = useState('');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [exactTeamSize, setExactTeamSize] = useState<string | null>(null);
const [generatingAnother, setGeneratingAnother] = useState(false);

  const handleExactTeamSizeChange = (value: string) => {
    setExactTeamSize(value);
  };

  // Handle form submission
  const handleGenerate = async () => {
    if (!isAuthenticated) {
      try {
        // Try to login first if not authenticated
        await login();
        toast.info('Please try generating a project after logging in');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Please login to generate project ideas');
      }
      return;
    }

    // Validate form
    if (!duration) {
      toast.error('Please select project duration');
      return;
    }
    if (!teamSize) {
      toast.error('Please select team size');
      return;
    }
    if (!category) {
      toast.error('Please select project category');
      return;
    }

    // Get complexity level label
    const getComplexityLabel = (value: number) => {
      if (value <= 33) return "beginner"; // Changed to lowercase
      if (value <= 66) return "intermediate"; // Changed to lowercase
      return "advanced"; // Changed to lowercase
    };

    // Prepare params
    const params = {
      technologies: selectedTechs,
      complexity: {
        level: getComplexityLabel(complexityLevel),
        percentage: complexityLevel,
      },
      duration,
      teamSize,
      exactTeamSize: exactTeamSize,
      category,
      projectTheme: projectTheme.trim()
    };

    try {
      // Use the mutation and get the result
      const result = await generateProject(params).unwrap();
      setCurrentProject(result.project);
      
      // Show warning message if present
      if (result.warning) {
        // Show warning toast with the message
        toast.warning(result.warning, {
          duration: 5000, // Show for 5 seconds
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
        });
        
        // Also set a warning state if you want to display it in the UI
        setWarningMessage(result.warning);
      } else {
        // Clear any previous warnings
        setWarningMessage(null);
      }
      
      toast.success('Project idea generated successfully!');
    } catch (error: any) {
      console.error('Generate project error:', error);
      toast.error(error.data?.message || 'Failed to generate project');
    }
  };

  useEffect(() => {
    // Reset exactTeamSize when teamSize changes
    setExactTeamSize(null);
  }, [teamSize]);

  // Handle project saving
  const handleSaveProject = async (projectId: string) => {
    if (!isAuthenticated) {
      try {
        await login();
        toast.info('Please try saving the project after logging in');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Please login to save projects');
      }
      return;
    }

    try {
      const result = await saveProject(projectId).unwrap();
      
      // Update local state
      if (currentProject && currentProject._id === projectId) {
        setCurrentProject(result.project);
      }
      
      toast.success('Project saved successfully!');
    } catch (error: any) {
      console.error('Save project error:', error);
      toast.error(error.data?.message || 'Failed to save project');
    }
  };

  // Handle generate another
  const handleGenerateAnother = async (projectId: string) => {
    if (!isAuthenticated) {
      try {
        await login();
        toast.info('Please try generating a new project after logging in');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Please login to generate projects');
      }
      return;
    }
  
    // Prevent multiple clicks
    if (generatingAnother) {
      return;
    }
  
    try {
      setGeneratingAnother(true); // Set generating state to true
      const result = await generateAnother(projectId).unwrap();
      setCurrentProject(result.project);
      toast.success('New project idea generated!');
    } catch (error: any) {
      console.error('Generate another error:', error);
      toast.error(error.data?.message || 'Failed to generate another project');
    } finally {
      setGeneratingAnother(false); // Reset generating state
    }
  };

  // Handle start project
  const handleStartProject = async (projectId: string) => {
    if (!isAuthenticated) {
      try {
        await login();
        toast.info('Please login to start a project');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Please login to start projects');
      }
      return;
    }

    try {
      await startProject(projectId).unwrap();
      toast.success('Project started successfully!');
      router.push('/profile');
    } catch (error: any) {
      console.error('Start project error:', error);
      toast.error(error.data?.message || 'Failed to start project');
    }
  };

  // Generate preview or result card
  const GenerateCard = () => {
    if (generating) {
      return (
        <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <CardTitle>Generating Your Project Idea</CardTitle>
                <CardDescription className="mt-2">
                  Please wait while we craft the perfect project based on your preferences...
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-center text-muted-foreground">
              <p>• Analyzing technology stack</p>
              <p>• Determining project scope</p>
              <p>• Generating features and structure</p>
              <p>• Crafting learning outcomes</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (currentProject) {
      return (
        <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{currentProject.title}</CardTitle>
                <CardDescription>{currentProject.subtitle}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleSaveProject(currentProject._id)}
                >
                  <Bookmark className={`h-4 w-4 ${currentProject.isSaved ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{currentProject.duration.estimate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{currentProject.teamSize.count}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{currentProject.complexity.level}</span>
              </div>
            </div>

            {/* Required Technologies */}
            <div>
              <h3 className="text-sm font-medium mb-2">Required Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {currentProject.technologies.map((tech: string, index: number) => (
                  <Badge key={index}>{tech}</Badge>
                ))}
              </div>
            </div>

            {/* Project Description */}
            <div>
              <h3 className="text-sm font-medium mb-2">Project Description</h3>
              <p className="text-muted-foreground">
                {currentProject.description}
              </p>
            </div>

            {/* Team Structure */}
            <div>
              <h3 className="text-sm font-medium mb-2">Team Structure</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Required Roles</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {currentProject.teamStructure.roles.map((role: any, index: number) => (
                      <li key={index}>{role.title}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Role Responsibilities</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {currentProject.teamStructure.roles.map((role: any, index: number) => (
                      <li key={index}>{role.responsibilities[0]}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div>
              <h3 className="text-sm font-medium mb-2">Project Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Core Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {currentProject.features.core.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Additional Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {currentProject.features.additional.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div>
              <h3 className="text-sm font-medium mb-2">Learning Outcomes</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {currentProject.learningOutcomes.map((outcome: string, index: number) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter>
            <div className="w-full flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                onClick={() => handleStartProject(currentProject._id)}
              >
                <Code2 className="h-4 w-4" />
                Start Project
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                onClick={() => handleGenerateAnother(currentProject._id)}
                disabled={generatingAnother}
              >
                {generatingAnother ? ( 
    <>
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      Generating...
    </>
  ) : (
    'Generate Another'
  )}
</Button>
            </div>
          </CardFooter>
        </Card>
      );
    }

    // Preview Card (Default State)
    return (
      <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
        <CardHeader>
          {/* Preview Alert */}
          <Alert className="mb-6 bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              This is a preview of how your generated project will look. The final output will be customized based on your preferences.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI-Powered Chat Application</CardTitle>
              <CardDescription>A real-time chat platform with AI capabilities</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" disabled>
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">2-3 months</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">3-4 members</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Intermediate</span>
            </div>
          </div>

          {/* Required Technologies */}
          <div>
            <h3 className="text-sm font-medium mb-2">Required Technologies</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>React</Badge>
              <Badge>Node.js</Badge>
              <Badge>Socket.io</Badge>
              <Badge>MongoDB</Badge>
              <Badge>OpenAI API</Badge>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <h3 className="text-sm font-medium mb-2">Project Description</h3>
            <p className="text-muted-foreground">
              Build a modern chat application that incorporates AI capabilities for enhanced user interaction. 
              The application will feature real-time messaging, AI-powered message suggestions, and automated responses.
            </p>
          </div>

          {/* Team Structure */}
          <div>
            <h3 className="text-sm font-medium mb-2">Team Structure</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Required Roles</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Frontend Lead (React, Socket.io)</li>
                  <li>Frontend Developer (UI/UX)</li>
                  <li>Backend Developer (Node.js, MongoDB)</li>
                  <li>AI/ML Integration Specialist</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Role Responsibilities</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Frontend: UI components, real-time updates</li>
                  <li>UI/UX: Design system, user experience</li>
                  <li>Backend: API, database, WebSocket server</li>
                  <li>AI: ML models, OpenAI integration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-sm font-medium mb-2">Project Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Core Features</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Real-time messaging system</li>
                  <li>User authentication</li>
                  <li>Message history & search</li>
                  <li>File sharing capabilities</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Additional Features</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Smart message suggestions</li>
                  <li>Automated responses</li>
                  <li>Sentiment analysis</li>
                  <li>Language translation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div>
            <h3 className="text-sm font-medium mb-2">Learning Outcomes</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Real-time application architecture</li>
              <li>AI/ML integration in web applications</li>
              <li>State management in real-time systems</li>
              <li>WebSocket implementation</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter>
          <div className="w-full flex flex-col sm:flex-row gap-3">
            {isAuthenticated ? (
              <Button 
                className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                onClick={handleGenerate}
              >
                <Code2 className="h-4 w-4" />
                Generate Project
              </Button>
            ) : (
              <Button 
                className="flex-1 gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                onClick={login}
              >
                <Code2 className="h-4 w-4" />
                Login to Start
              </Button>
            )}
            <Button 
              variant="outline" 
              className="flex-1 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
              onClick={() => router.push('/ideas')}
            >
              Explore Examples
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <TechBackground/>
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-8">
          <div className="container px-4 mx-auto text-center">
          <motion.h1 
  className="text-4xl md:text-5xl font-bold mb-6 font-orbitron relative inline-block"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
    Generate Your Next
  </span>{" "}
  <span className="text-black dark:text-white">
    Project
  </span>
  <motion.div
    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50"
    initial={{ width: "0%" }}
    animate={{ width: "100%" }}
    transition={{ delay: 0.5, duration: 0.8 }}
  />
</motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Tell us your preferred technologies and requirements, and we&apos;ll generate the perfect project idea for you.
            </motion.p>
          </div>
        </section>

{isAuthenticated && user?.plan === "free" && (user?.projectIdeasLeft ?? 0) <= 1 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="container px-4 mx-auto mb-8"
  >
    <Card className="bg-yellow-500/10 border-yellow-500/20 border-dashed">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span className="text-sm">
          {user.projectIdeasLeft === 0 
  ? "You've reached your project idea limit" 
  : `Only ${user.projectIdeasLeft} project ${user.projectIdeasLeft === 1 ? 'idea' : 'ideas'} remaining this month`}
          </span>
        </div>
        <Button 
          size="sm"
          onClick={() => router.push('/pricing')}
          className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  </motion.div>
)}
{isAuthenticated && user?.plan === "pro" && (user?.projectIdeasLeft ?? 0) <= 1 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="container px-4 mx-auto mb-8"
  >
    <Card className="bg-yellow-500/10 border-yellow-500/20 border-dashed">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span className="text-sm">
          {user.projectIdeasLeft === 0 
  ? "You've reached your project idea limit" 
  : `Only ${user.projectIdeasLeft} project ${user.projectIdeasLeft === 1 ? 'idea' : 'ideas'} remaining`}
          </span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)}
        {/* Main Content */}
        <section className="container px-4 mx-auto">
           {/* Warning Message Alert */}
  {warningMessage && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Alert className="bg-yellow-500/10 border-yellow-500/20">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <AlertDescription className="text-yellow-700 dark:text-yellow-400 ml-2">
          {warningMessage}
        </AlertDescription>
      </Alert>
    </motion.div>
  )}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Preferences Panel */}
            <div className="lg:col-span-2">
              <div className="group relative">
                <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
                
                <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1">
                  <CardHeader>
                    <CardTitle>Project Preferences</CardTitle>
                    <CardDescription>Customize your project generation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Technologies Multi-select */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Technologies</label>
                      <TechSelect 
                        onSelect={setSelectedTechs} 
                        defaultValue={[]} 
                      />
                    </div>

                    {/* Project Complexity */}
                    <div className="space-y-2">
                      <ComplexitySlider
                        defaultValue={complexityLevel}
                        onChange={setComplexityLevel}
                      />
                    </div>

                    {/* Project Duration */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estimated Duration</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="w-full select-trigger">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent sideOffset={4} className="select-content">
                          <SelectItem value="small">Small (1-2 weeks)</SelectItem>
                          <SelectItem value="medium">Medium (1-2 months)</SelectItem>
                          <SelectItem value="large">Large (3+ months)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Team Size */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Team Size</label>
                      <Select value={teamSize} onValueChange={setTeamSize}>
                        <SelectTrigger className="w-full select-trigger">
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent sideOffset={4} className="select-content">
                          <SelectItem value="solo">Solo Project</SelectItem>
                          <SelectItem value="small">2-3 Members</SelectItem>
                          <SelectItem value="medium">4-6 Members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Exact Team Size - Conditional render */}
{teamSize && teamSize !== 'solo' && (
  <div className="space-y-2 mt-4 animate-in fade-in-50 duration-300">
    <label className="text-sm font-medium">Exact Number of Members (Optional)</label>
    <div className="bg-black/5 dark:bg-white/5 rounded-md p-3">
      <RadioGroup
        value={exactTeamSize || ''}
        onValueChange={handleExactTeamSizeChange}
        className="flex flex-wrap gap-3"
      >
        {teamSize === 'small' ? (
          <>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="team-size-2" />
              <label htmlFor="team-size-2" className="text-sm cursor-pointer">2 Members</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="team-size-3" />
              <label htmlFor="team-size-3" className="text-sm cursor-pointer">3 Members</label>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="team-size-4" />
              <label htmlFor="team-size-4" className="text-sm cursor-pointer">4 Members</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="team-size-5" />
              <label htmlFor="team-size-5" className="text-sm cursor-pointer">5 Members</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6" id="team-size-6" />
              <label htmlFor="team-size-6" className="text-sm cursor-pointer">6 Members</label>
            </div>
          </>
        )}
      </RadioGroup>
      {exactTeamSize && (
        <p className="text-xs text-muted-foreground mt-2">
          AI will generate a project structure for exactly {exactTeamSize} team members.
        </p>
      )}
    </div>
  </div>
)}

                    {/* Project Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Category</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full select-trigger">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent sideOffset={4} className="select-content">
                          <SelectItem value="web">Web Application</SelectItem>
                          <SelectItem value="mobile">Mobile App</SelectItem>
                          <SelectItem value="ai">AI/ML</SelectItem>
                          <SelectItem value="game">Game Development</SelectItem>
                          <SelectItem value="data">Data Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Project Theme (new field) */}
<div className="space-y-2">
  <label className="text-sm font-medium">Project Theme (Optional)</label>
  <Input 
    placeholder="E.g., Social media, Health, Productivity, Education..."
    value={projectTheme}
    onChange={(e) => setProjectTheme(e.target.value)}
  />
  <p className="text-xs text-muted-foreground">
    A theme to guide the project idea generation (optional)
  </p>
</div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none" 
                      size="lg"
                      onClick={handleGenerate}
                      disabled={generating}
                    >
                      {generating ? (
                        <>
                          <RefreshCcw className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Project Idea
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Results Panel */}
            <motion.div 
              className="lg:col-span-3 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="group relative">
                {/* Background shadow element */}
                <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
                
                {/* Main card */}
                <GenerateCard />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="relative my-20">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t-2 border-black/20 dark:border-white/20"></div>
          </div>
          
          <div className="relative flex justify-center">
            <div className="group relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+8px)] h-[calc(100%+8px)] rounded-full bg-black/10 dark:bg-white/10 blur-md transform-gpu transition-all duration-300 group-hover:blur-lg group-hover:scale-110" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] rounded-full bg-black/5 dark:bg-white/5 blur-sm transform-gpu transition-all duration-300 group-hover:blur-md group-hover:scale-105" />
              
              <span className="relative inline-flex items-center justify-center bg-white dark:bg-black px-8 py-3 text-base font-semibold rounded-full border-2 border-black/20 dark:border-white/20 transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
                <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                  OR
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Have a Project Idea Section */}
        <ProjectSubmission/>
        <Footer />
      </main>
    </PageTransition>
  );
}