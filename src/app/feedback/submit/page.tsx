'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import FeedbackForm from '@/components/FeedbackForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SubmitFeedbackPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <TechBackground />
        <Header />
        
        <section className="pt-32 pb-20">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl mx-auto mb-8">
              <Button 
                variant="ghost" 
                className="mb-6"
                onClick={() => router.push('/feedback')}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Feedback
              </Button>
              
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
               <h1 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron inline-block">
  <span className="relative">
    <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
      Submit
    </span>{" "}
    <span className="text-black dark:text-white">
      Feedback
    </span>
    <motion.div
      className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50"
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{ delay: 0.5, duration: 0.8 }}
    />
  </span>
</h1>
                <p className="text-lg text-muted-foreground">
                  Your feedback helps us improve Projectrix for everyone
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FeedbackForm />
              </motion.div>
            </div>
          </div>
        </section>
        
        <Footer />
      </main>
    </PageTransition>
  );
}