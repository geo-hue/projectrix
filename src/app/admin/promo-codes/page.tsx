// src/app/admin/promo-codes/page.tsx
'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PromoCodesManager from '@/components/PromoCodesManager';

export default function AdminPromoCodesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Redirect non-admins
  React.useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/profile');
    }
  }, [user, loading, router]);
  
  return (
    <PageTransition>
      <main className="min-h-screen bg-background">
        <TechBackground />
        <Header />
        
        <section className="pt-32 pb-20">
          <div className="container px-4 mx-auto">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                  Admin
                </span>{" "}
                <span className="text-black dark:text-white">
                  Promo Codes
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Create and manage promotional codes for users to redeem Pro access.
              </p>
            </motion.div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : user?.role === 'admin' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PromoCodesManager />
              </motion.div>
            ) : (
              <Card className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
                <p className="text-muted-foreground">
                  You don&apos;t have permission to view this page.
                </p>
              </Card>
            )}
          </div>
        </section>
        
        <Footer />
      </main>
    </PageTransition>
  );
}