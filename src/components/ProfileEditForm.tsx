import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUpdateUserProfileMutation } from "@/app/api/userProfileApiSlice";
import { Loader2, Save, X } from "lucide-react";
import { SimpleTechSelector } from './SimpleTechSelector';
import { Badge } from './ui/badge';

// Define the form schema with zod
const profileFormSchema = z.object({
  bio: z.string().max(500, { message: "Bio cannot be more than 500 characters" }),
  website: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)),
  githubProfile: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)),
  twitterProfile: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)),
  linkedinProfile: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)),
  availability: z.enum(["available", "limited", "unavailable"]),
  hoursPerWeek: z.string(),
  skills: z.array(z.string()),
  preferredTechnologies: z.array(z.string()),
  preferredRoles: z.array(z.string()),
  publicEmail: z.boolean().default(false)
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  profile: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile, onCancel, onSuccess }) => {
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');

  // Initialize form with current profile data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: profile?.bio || "",
      website: profile?.website || "",
      githubProfile: profile?.githubProfile || "",
      twitterProfile: profile?.twitterProfile || "",
      linkedinProfile: profile?.linkedinProfile || "",
      availability: profile?.availability || "available",
      hoursPerWeek: profile?.hoursPerWeek || "10-20 hours",
      skills: profile?.skills || [],
      preferredTechnologies: profile?.preferredTechnologies || [],
      preferredRoles: profile?.preferredRoles || [],
      publicEmail: profile?.publicEmail || false
    }
  });

  useEffect(() => {
    setPreferredRoles(profile?.preferredRoles || []);
  }, [profile]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Add preferred roles to the form data
      data.preferredRoles = preferredRoles;
      
      await updateProfile(data).unwrap();
      toast.success("Profile updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleAddRole = () => {
    if (newRole && !preferredRoles.includes(newRole)) {
      setPreferredRoles([...preferredRoles, newRole]);
      setNewRole('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setPreferredRoles(preferredRoles.filter(r => r !== role));
  };

  return (
    <Card className="bg-white dark:bg-black border border-black/20 dark:border-white/20">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information and preferences</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself, your experience, and interests..." 
                      className="min-h-32 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on your public profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills */}
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <SimpleTechSelector 
                      onSelect={(skills) => form.setValue('skills', skills)} 
                      defaultValue={field.value} 
                    />
                  </FormControl>
                  <FormDescription>
                    Select the skills you have expertise in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Technologies */}
            <FormField
              control={form.control}
              name="preferredTechnologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Technologies</FormLabel>
                  <FormControl>
                    <SimpleTechSelector 
                      onSelect={(techs) => form.setValue('preferredTechnologies', techs)} 
                      defaultValue={field.value} 
                    />
                  </FormControl>
                  <FormDescription>
                    Technologies you prefer to work with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Roles */}
            <div className="space-y-2">
              <FormLabel>Preferred Roles</FormLabel>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Add role (e.g., Frontend Developer)" 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRole();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddRole}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferredRoles.map((role, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(role)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Roles you prefer to take on projects.
              </FormDescription>
            </div>

            {/* Social Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitterProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter / X Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedinProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Availability */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="limited">Limited Availability</SelectItem>
                        <SelectItem value="unavailable">Currently Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your current availability for new projects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hoursPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours Per Week</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hours per week" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Less than 5 hours">Less than 5 hours</SelectItem>
                        <SelectItem value="5-10 hours">5-10 hours</SelectItem>
                        <SelectItem value="10-20 hours">10-20 hours</SelectItem>
                        <SelectItem value="20-30 hours">20-30 hours</SelectItem>
                        <SelectItem value="30+ hours">30+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Hours you can dedicate to projects weekly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Public Email */}
            <FormField
              control={form.control}
              name="publicEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show email on public profile</FormLabel>
                    <FormDescription>
                      Allow others to see your email address on your public profile.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
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
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProfileEditForm;