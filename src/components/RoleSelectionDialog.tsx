import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RoleSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedRole: string) => Promise<void>;
  projectTitle: string;
  roles: Array<{
    title: string;
    skills: string[];
    responsibilities: string[];
    filled: boolean;
  }>;
}

const RoleSelectionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  roles
}: RoleSelectionDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(selectedRole);
      toast.success('Project published with your selected role!');
      onClose();
    } catch (error) {
      console.error('Error publishing project with role:', error);
      toast.error('Failed to publish project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset selected role when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedRole('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black border border-black/20 dark:border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Select Your Role</DialogTitle>
          <DialogDescription>
            Before publishing "{projectTitle}", please select the role you'll take in this project.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-primary/5 p-3">
              <AlertCircle className="h-5 w-5 text-primary inline-block mr-2" />
              <span className="text-sm">
                As the project creator, you need to choose your role in the team. 
                Other roles will be available for collaborators to apply for.
              </span>
            </div>
          </div>

          <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-3">
            {roles.map((role) => (
              <div
                key={role.title}
                className="flex items-start space-x-2 rounded-md border border-black/10 dark:border-white/10 p-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <RadioGroupItem value={role.title} id={role.title} />
                <div className="flex-1 space-y-1">
                  <Label 
                    htmlFor={role.title} 
                    className="text-base font-medium cursor-pointer"
                  >
                    {role.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {role.responsibilities[0]}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {role.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="gap-2 bg-white dark:bg-black text-black dark:text-white border-2 border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || !selectedRole}
            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Publish Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionDialog;