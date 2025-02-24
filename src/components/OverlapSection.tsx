// components/OverlapSection.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface OverlapSectionProps {
  children: React.ReactNode;
  index: number;
  bgColor?: string;
}

export default function OverlapSection({ children, index, bgColor = "bg-background" }: OverlapSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"]
  });

  return (
    <motion.section
      ref={ref}
      className={`${index === 0 ? 'min-h-screen relative' : 'relative min-h-screen'} ${bgColor} w-full`}
      style={{
        zIndex: index
      }}
    >
      {children}
    </motion.section>
  );
}