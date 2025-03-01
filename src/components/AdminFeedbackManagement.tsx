// src/components/AdminFeedbackManagement.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bug,
  Lightbulb,
  ArrowUp,
  Star,
  ThumbsUp,
  Filter,
  Loader2,
  MessageSquare,
  CheckCircle2,
  ClipboardCheck,
  TimerReset,
  ShieldAlert,
  RefreshCw,
  XCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllFeedbackQuery, useUpdateFeedbackStatusMutation } from '@/app/api/feedbackApiSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Category icon mapping
const categoryIcons = {
  bug: <Bug className="h-4 w-4 text-red-500" />,
  feature: <Lightbulb className="h-4 w-4 text-yellow-500" />,
  improvement: <ArrowUp className="h-4 w-4 text-green-500" />,
  general: <Star className="h-4 w-4 text-blue-500" />
};

// Status badges with icons
const statusInfo = {
  pending: {
    badge: <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>,
    icon: <TimerReset className="h-4 w-4" />,
    text: 'Mark as Pending'
  },
  'under-review': {
    badge: <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Under Review</Badge>,
    icon: <RefreshCw className="h-4 w-4" />,
    text: 'Mark as Under Review'
  },
  implemented: {
    badge: <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Implemented</Badge>,
    icon: <CheckCircle2 className="h-4 w-4" />,
    text: 'Mark as Implemented'
  },
  declined: {
    badge: <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Declined</Badge>,
    icon: <XCircle className="h-4 w-4" />,
    text: 'Mark as Declined'
  }
};

const AdminFeedbackManagement: React.FC = () => {
  // Filter states
  const [category, setCategory] = useState<string