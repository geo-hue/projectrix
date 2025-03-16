// src/components/EnhancementConfirmationModal.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from 'lucide-react';

interface EnhancementConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (useEnhancement: boolean) => void;
  enhancementsLeft: number;
  isPro: boolean;
}

const EnhancementConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  enhancementsLeft,
  isPro,
}: EnhancementConfirmationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async (useEnhancement: boolean) => {
    setIsSubmitting(true);
    try {
      await onConfirm(useEnhancement);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border-2 border-black/10 dark:border-white/10 dark:bg-black dark:bg-opacity-95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Enhance Your Project with AI</DialogTitle>
          <DialogDescription>
            Would you like to use AI to enhance your project details?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-md bg-blue-500/10 border border-blue-500/20">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <div className="text-sm">
              <p className="font-medium">AI Enhancement will:</p>
              <ul className="list-disc ml-5 text-muted-foreground mt-1 space-y-1">
                <li>Expand project descriptions</li>
                <li>Add missing features and learning outcomes</li>
                <li>Create detailed role responsibilities</li>
                <li>Refine overall project structure</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-md bg-muted/50 border border-muted">
            <p className="text-sm mb-2">
              <span className="font-medium">Enhancements remaining:</span>{' '}
              <span className="font-bold text-primary">{enhancementsLeft}</span> / {isPro ? '8' : '2'}
            </p>
            {!isPro && enhancementsLeft === 0 && (
              <p className="text-xs text-muted-foreground">
                Upgrade to Pro for 8 enhancements per month instead of 2.
              </p>
            )}
            {isPro && enhancementsLeft === 0 && (
              <p className="text-xs text-muted-foreground">
                Your monthly enhancement limit has been reached. Limits reset at the beginning of each month.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button
            variant="outline"
            onClick={() => handleConfirm(false)}
            disabled={isSubmitting}
          >
            Submit As Is
          </Button>
          <Button
            onClick={() => handleConfirm(true)}
            disabled={isSubmitting || enhancementsLeft === 1}
            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Enhance with AI
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancementConfirmationModal;