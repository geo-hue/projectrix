'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useSubmitFeedbackMutation } from '@/app/api/feedbackApiSlice';
import { Star, Bug, Lightbulb, ArrowUp, Loader2 } from 'lucide-react';

const FeedbackForm: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  
  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    rating: 5,
    tags: [] as string[]
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      try {
        await login();
        toast.info('Please submit your feedback after logging in');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Please login to submit feedback');
      }
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a feedback category');
      return;
    }
    
    if (!formData.title) {
      toast.error('Please provide a title for your feedback');
      return;
    }
    
    if (!formData.description) {
      toast.error('Please provide details about your feedback');
      return;
    }
    
    try {
      await submitFeedback({
        category: formData.category as any,
        title: formData.title,
        description: formData.description,
        rating: formData.rating,
        tags: formData.tags
      }).unwrap();
      
      toast.success('Thank you for your feedback!');
      
      // Reset form
      setFormData({
        category: '',
        title: '',
        description: '',
        rating: 5,
        tags: []
      });
      
      // Redirect to feedback list
      router.push('/feedback');
    } catch (error: any) {
      console.error('Submit feedback error:', error);
      toast.error(error.data?.message || 'Failed to submit feedback');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-2 translate-y-2 rounded-lg" />
      
      <Card className="relative bg-white dark:bg-black border border-black/20 dark:border-white/20 transition-all">
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription>
            Share your thoughts, report bugs, or suggest improvements
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Feedback Type</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-red-500" />
                      <span>Bug Report</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="feature">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span>Feature Request</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="improvement">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span>Improvement</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="general">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-500" />
                      <span>General Feedback</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Feedback Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                placeholder="Brief summary of your feedback"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.title.length}/100
              </p>
            </div>
            
            {/* Feedback Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about your feedback..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/1000
              </p>
            </div>
            
            {/* Rating */}
            <div className="space-y-2">
              <Label>Rate Your Experience</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleInputChange('rating', star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        formData.rating >= star
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tags"
                  placeholder="Add tag and press Enter"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value && !formData.tags.includes(value)) {
                        handleInputChange('tags', [...formData.tags, value]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(
                            'tags',
                            formData.tags.filter((_, i) => i !== index)
                          )
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit"
              className="w-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default FeedbackForm;