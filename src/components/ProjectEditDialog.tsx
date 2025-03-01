import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Plus, 
  X, 
  Code2, 
  MoveRight,
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useEditProjectMutation } from '@/app/api/projectApiSlice';
import { TechSelect } from '@/components/TechSelect';
import { SimpleTechSelector } from './SimpleTechSelector';

// Collapsible section component for better organization
const CollapsibleSection = ({ title, children, isOpen, toggle }) => {
  return (
    <div className="border rounded-md overflow-hidden mb-6 bg-white dark:bg-black border-black/20 dark:border-white/20">
    <button 
  onClick={(e) => {
    e.preventDefault(); // Prevent form submission
    toggle();
  }} 
  type="button" 
  className="w-full p-3 text-left flex justify-between items-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
>
  <span className="font-medium">{title}</span>
  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
</button>
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

const ProjectEditDialog = ({ project, isOpen, onClose }) => {
  const [editProject, { isLoading }] = useEditProjectMutation();
  
  // States for collapsible sections
  const [sectionsOpen, setSectionsOpen] = useState({
    features: true,
    teamStructure: false,
    learningOutcomes: false
  });

  const toggleSection = (section) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Features state
  const [coreFeatures, setCoreFeatures] = useState(project?.features?.core || []);
  const [additionalFeatures, setAdditionalFeatures] = useState(project?.features?.additional || []);
  const [newFeature, setNewFeature] = useState('');
  const [featureType, setFeatureType] = useState('core');
  
  // Team roles state
  const [teamRoles, setTeamRoles] = useState(project?.teamStructure?.roles || []);
  const [currentRole, setCurrentRole] = useState({
    title: '',
    skills: [],
    responsibilities: [],
    filled: false
  });
  const [editingRoleIndex, setEditingRoleIndex] = useState(-1);
  const [newResponsibility, setNewResponsibility] = useState('');
  
  // Learning outcomes state
  const [learningOutcomes, setLearningOutcomes] = useState(project?.learningOutcomes || []);
  const [newOutcome, setNewOutcome] = useState('');
  
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Create form
  const form = useForm({
    defaultValues: {
      title: project?.title || '',
      subtitle: project?.subtitle || '',
      description: project?.description || '',
      technologies: project?.technologies || []
    }
  });
  
  // Update form when project changes
  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        technologies: project.technologies || []
      });
      setCoreFeatures(project.features?.core || []);
      setAdditionalFeatures(project.features?.additional || []);
      setTeamRoles(project.teamStructure?.roles || []);
      setLearningOutcomes(project.learningOutcomes || []);
    }
  }, [project, form]);
  
  // Handle feature functions
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      if (featureType === 'core') {
        setCoreFeatures([...coreFeatures, newFeature.trim()]);
      } else {
        setAdditionalFeatures([...additionalFeatures, newFeature.trim()]);
      }
      setNewFeature('');
    }
  };
  
  const handleRemoveFeature = (feature, type) => {
    if (type === 'core') {
      setCoreFeatures(coreFeatures.filter(f => f !== feature));
    } else {
      setAdditionalFeatures(additionalFeatures.filter(f => f !== feature));
    }
  };
  
  // Handle team role functions
  const handleSaveRole = () => {
    if (currentRole.title.trim() && currentRole.responsibilities.length > 0) {
      if (editingRoleIndex >= 0) {
        // Update existing role
        const updatedRoles = [...teamRoles];
        updatedRoles[editingRoleIndex] = currentRole;
        setTeamRoles(updatedRoles);
      } else {
        // Add new role
        setTeamRoles([...teamRoles, currentRole]);
      }
      
      // Reset form
      setCurrentRole({
        title: '',
        skills: [],
        responsibilities: [],
        filled: false
      });
      setEditingRoleIndex(-1);
    } else {
      toast.error('Role title and at least one responsibility are required');
    }
  };
  
  const handleEditRole = (index) => {
    setCurrentRole(teamRoles[index]);
    setEditingRoleIndex(index);
  };
  
  const handleRemoveRole = (index) => {
    setTeamRoles(teamRoles.filter((_, i) => i !== index));
    if (editingRoleIndex === index) {
      setCurrentRole({
        title: '',
        skills: [],
        responsibilities: [],
        filled: false
      });
      setEditingRoleIndex(-1);
    }
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setCurrentRole({
        ...currentRole,
        responsibilities: [...currentRole.responsibilities, newResponsibility.trim()]
      });
      setNewResponsibility('');
    }
  };
  
  const handleRemoveResponsibility = (resp) => {
    setCurrentRole({
      ...currentRole,
      responsibilities: currentRole.responsibilities.filter(r => r !== resp)
    });
  };
  
  // Handle learning outcomes
  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };
  
  const handleRemoveOutcome = (outcome) => {
    setLearningOutcomes(learningOutcomes.filter(o => o !== outcome));
  };

  const onTechSelect = (techs) => {
    form.setValue('technologies', techs);
  };
  
  // Form submission
  const onSubmit = async (data) => {
    try {
      // Add all the required fields to the form data
      const projectData = {
        ...data,
        features: {
          core: coreFeatures,
          additional: additionalFeatures
        },
        teamStructure: {
          roles: teamRoles
        },
        learningOutcomes
      };
      
      await editProject({
        projectId: project._id,
        projectData
      }).unwrap();
      
      toast.success('Project updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Edit error:', error);
    }
  };
  
  // Handle form cancel
  const handleCancel = () => {
    if (form.formState.isDirty || 
        JSON.stringify(coreFeatures) !== JSON.stringify(project?.features?.core) ||
        JSON.stringify(additionalFeatures) !== JSON.stringify(project?.features?.additional) ||
        JSON.stringify(teamRoles) !== JSON.stringify(project?.teamStructure?.roles) ||
        JSON.stringify(learningOutcomes) !== JSON.stringify(project?.learningOutcomes)) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-black border border-black/20 dark:border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Project</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              {/* Basic Information Section */}
              <div className="space-y-4 mb-6">
                <div className="pb-2 mb-2 border-b border-black/10 dark:border-white/10">
                  <h3 className="text-lg font-bold">Basic Information</h3>
                </div>
                
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter project title" 
                          {...field} 
                          className="bg-white dark:bg-black border border-black/20 dark:border-white/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Subtitle */}
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Project Subtitle</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief description" 
                          {...field} 
                          className="bg-white dark:bg-black border border-black/20 dark:border-white/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the project" 
                          className="min-h-32 bg-white dark:bg-black border border-black/20 dark:border-white/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Technologies */}
                <FormField
  control={form.control}
  name="technologies"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="font-medium">Technologies</FormLabel>
      <FormControl>
        <SimpleTechSelector 
          onSelect={onTechSelect} 
          defaultValue={field.value} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

              </div>
              
              {/* Features Section */}
              <CollapsibleSection 
                title="Features" 
                isOpen={sectionsOpen.features}
                toggle={() => toggleSection('features')}
              >
                <div className="space-y-4">
                  {/* Feature Input */}
                  <div className="space-y-2">
                    <FormLabel className="font-medium">Add Feature</FormLabel>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <select 
                        className="p-2 border rounded-md flex-none bg-white dark:bg-black border-black/20 dark:border-white/20"
                        value={featureType}
                        onChange={(e) => setFeatureType(e.target.value)}
                      >
                        <option value="core">Core Feature</option>
                        <option value="additional">Additional Feature</option>
                      </select>
                      
                      <div className="flex flex-1 w-full sm:w-auto items-center gap-2">
                        <Input
                          placeholder="Add feature"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          className="flex-1 bg-white dark:bg-black border border-black/20 dark:border-white/20"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        />
                  <Button 
  type="button" 
  variant="outline"
  onClick={handleAddFeature}
  className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
>
  <Plus className="h-4 w-4" />
</Button>

                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* Core Features List */}
                    <div>
                      <h4 className="font-medium mb-3">Core Features</h4>
                      <div className="max-h-60 overflow-y-auto pr-1">
                        {coreFeatures.length === 0 ? (
                          <div className="text-sm text-muted-foreground py-2">
                            No core features added yet
                          </div>
                        ) : (
                          <ul className="space-y-2">
                            {coreFeatures.map((feature, index) => (
                              <li key={index} className="group flex items-center justify-between p-2 border rounded-md bg-white dark:bg-black border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <span className="mr-2 text-sm">{feature}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFeature(feature, 'core')}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    
                    {/* Additional Features List */}
                    <div>
                      <h4 className="font-medium mb-3">Additional Features</h4>
                      <div className="max-h-60 overflow-y-auto pr-1">
                        {additionalFeatures.length === 0 ? (
                          <div className="text-sm text-muted-foreground py-2">
                            No additional features added yet
                          </div>
                        ) : (
                          <ul className="space-y-2">
                            {additionalFeatures.map((feature, index) => (
                              <li key={index} className="group flex items-center justify-between p-2 border rounded-md bg-white dark:bg-black border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <span className="mr-2 text-sm">{feature}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFeature(feature, 'additional')}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
              
              {/* Team Structure Section */}
              <CollapsibleSection 
                title="Team Structure" 
                isOpen={sectionsOpen.teamStructure}
                toggle={() => toggleSection('teamStructure')}
              >
                <div className="space-y-6">
                  {/* Role Editor */}
                  <div className="p-4 border rounded-md bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20">
                    <h4 className="font-medium mb-4 border-b pb-2 border-black/10 dark:border-white/10">
                      {editingRoleIndex >= 0 ? 'Edit Role' : 'Add New Role'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <FormLabel className="font-medium">Role Title</FormLabel>
                        <Input
                          placeholder="e.g. Frontend Developer"
                          value={currentRole.title}
                          onChange={(e) => setCurrentRole({...currentRole, title: e.target.value})}
                          className="mt-1 bg-white dark:bg-black border border-black/20 dark:border-white/20"
                        />
                      </div>
                      
                      <div>
                        <FormLabel className="font-medium">Skills</FormLabel>
                        <SimpleTechSelector 
    onSelect={(techs) => setCurrentRole({...currentRole, skills: techs})}
    defaultValue={currentRole.skills} 
  />
                      </div>
                      
                      <div>
                        <FormLabel className="font-medium">Responsibilities</FormLabel>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            placeholder="Add responsibility"
                            value={newResponsibility}
                            onChange={(e) => setNewResponsibility(e.target.value)}
                            className="flex-1 bg-white dark:bg-black border border-black/20 dark:border-white/20"
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsibility())}
                          />
                       <Button 
  type="button" 
  variant="outline"
  size="sm"
  onClick={handleAddResponsibility}
  className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black"
>
  <Plus className="h-4 w-4" />
</Button>
                        </div>
                        <div className="max-h-36 overflow-y-auto mt-2">
                          <ul className="space-y-2">
                            {currentRole.responsibilities.map((resp, index) => (
                              <li key={index} className="group flex items-center justify-between p-2 border rounded-md bg-white dark:bg-black border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <span className="mr-2 text-sm">{resp}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveResponsibility(resp)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="pt-2 flex justify-end gap-2">
                        {editingRoleIndex >= 0 && (
                       <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         setCurrentRole({
                           title: '',
                           skills: [],
                           responsibilities: [],
                           filled: false
                         });
                         setEditingRoleIndex(-1);
                       }}
                       className="bg-white dark:bg-black text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
                     >
                       Cancel Edit
                     </Button>
                        )}
                   <Button
  type="button"
  onClick={handleSaveRole}
  disabled={!currentRole.title || currentRole.responsibilities.length === 0}
  className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
>
  {editingRoleIndex >= 0 ? 'Update Role' : 'Add Role'}
</Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Team Roles List */}
                  <div>
                    <h4 className="font-medium mb-3">Team Roles</h4>
                    {teamRoles.length === 0 ? (
                      <div className="text-sm text-muted-foreground py-4 text-center border rounded-md border-dashed border-black/20 dark:border-white/20">
                        No roles added yet. Add team roles above to define your project's team structure.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {teamRoles.map((role, index) => (
                          <motion.div 
                            key={index} 
                            className="p-3 border rounded-md bg-white dark:bg-black border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex flex-wrap md:flex-nowrap md:items-start justify-between gap-2">
                              <div className="flex-1">
                                <h5 className="font-medium text-lg">{role.title}</h5>
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-muted-foreground">Skills:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {role.skills && role.skills.length > 0 ? (
                                      role.skills.map((skill, i) => (
                                        <Badge key={i} variant="outline" className="text-xs bg-white dark:bg-black border-black/20 dark:border-white/20">
                                          {skill}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-sm text-muted-foreground">No specific skills defined</span>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-muted-foreground">Responsibilities:</p>
                                  <ul className="text-sm list-disc list-inside mt-1 space-y-1">
                                    {role.responsibilities.map((resp, i) => (
                                      <li key={i} className="text-muted-foreground">{resp}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="flex gap-2 self-start">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRole(index)}
                                  className="text-xs h-8"
                                >
                                  Edit
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRole(index)}
                                  className="text-xs h-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleSection>
              
              {/* Learning Outcomes Section */}
              <CollapsibleSection 
                title="Learning Outcomes" 
                isOpen={sectionsOpen.learningOutcomes}
                toggle={() => toggleSection('learningOutcomes')}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Input
                      placeholder="Add learning outcome"
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      className="flex-1 bg-white dark:bg-black border border-black/20 dark:border-white/20"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
                    />
                    <Button 
  type="button" 
  variant="outline"
  onClick={handleAddOutcome}
  className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:text-white dark:hover:text-black"
>
  <Plus className="h-4 w-4" />
</Button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto pr-1">
                    {learningOutcomes.length === 0 ? (
                      <div className="text-sm text-muted-foreground py-4 text-center border rounded-md border-dashed border-black/20 dark:border-white/20">
                        No learning outcomes added yet. What will developers learn from this project?
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {learningOutcomes.map((outcome, index) => (
                          <motion.li 
                            key={index} 
                            className="group flex items-center justify-between p-2 border rounded-md bg-white dark:bg-black border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="mr-2 text-sm">{outcome}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOutcome(outcome)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CollapsibleSection>
              
              <DialogFooter className="pt-4 border-t border-black/10 dark:border-white/10 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="bg-white dark:bg-black border border-black/20 dark:border-white/20"
                >
                  Cancel
                </Button>
                <Button 
  type="submit"
  disabled={isLoading}
  className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
>
  {isLoading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    <>
      <Code2 className="h-4 w-4" />
      Save Changes
    </>
  )}
</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              onClick={() => setShowConfirm(false)}
              className="bg-white dark:bg-black border border-black/20 dark:border-white/20"
            >
              Continue Editing
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowConfirm(false);
                onClose();
              }}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_2px_0_0_rgba(0,0,0,1)] dark:shadow-[0_2px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export default ProjectEditDialog;