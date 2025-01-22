'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="min-h-screen">
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 z-50 origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 z-50 origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
