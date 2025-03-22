"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TechBackground from "@/components/TechBackground";
import PageTransition from "@/components/PageTransition";
import FeedbackList from "@/components/FeedbackList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetPublicFeedbackQuery } from "@/app/api/feedbackApiSlice";

export default function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshParam = searchParams.get('refresh');
  
  // Get the query hook and its refetch function
  const { refetch } = useGetPublicFeedbackQuery({});
  
  // Refetch data when the refresh parameter changes
  useEffect(() => {
    if (refreshParam) {
      refetch();
    }
  }, [refreshParam, refetch]);

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <TechBackground />
        <Header />

        <section className="pt-32 pb-20">
          <div className="container px-4 mx-auto">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron inline-block">
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                    Community
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
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Help us improve Projectrix by sharing your thoughts, reporting
                bugs, or suggesting new features.
              </p>
              <div className="mt-8">
                <Button
                  onClick={() => router.push("/feedback/submit")}
                  className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] transform transition-all active:translate-y-1 active:shadow-none"
                >
                  <PlusCircle className="h-4 w-4" />
                  Submit New Feedback
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <FeedbackList key={refreshParam || 'default'} />
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
}