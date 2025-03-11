'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, FileCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const TermsOfServicePage = () => {
  const router = useRouter();

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: (
        <div className="space-y-4">
          <p>
            By accessing or using the Projectrix platform ("Service"), you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you may not access the Service.
          </p>
        </div>
      )
    },
    {
      id: 'service-description',
      title: 'Description of Service',
      content: (
        <div className="space-y-4">
          <p>
            Projectrix is a platform that provides AI-generated project ideas, collaboration tools, and project management 
            features for developers. We offer both free and paid subscription plans with varying features and limitations.
          </p>
        </div>
      )
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      content: (
        <div className="space-y-4">
          <p>
            To access certain features of the Service, you must create an account using GitHub authentication. 
            You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use of your account</li>
          </ul>
          <p>
            We reserve the right to terminate accounts, remove or edit content at our sole discretion.
          </p>
        </div>
      )
    },
    {
      id: 'subscription',
      title: 'Subscription Plans and Fees',
      content: (
        <div className="space-y-4">
          <p>
            Projectrix offers both free and paid subscription plans:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <Card className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10">
              <CardContent className="pt-6">
                <h4 className="text-lg font-medium mb-2">Free Plan</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>3 project ideas per month</li>
                  <li>1 published project</li>
                  <li>1 active collaboration at a time</li>
                  <li>Discord channel access</li>
                  <li>Community feedback submission</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white/50 dark:bg-black/50 border border-primary/20">
              <CardContent className="pt-6">
                <h4 className="text-lg font-medium mb-2">Pro Plan</h4>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>Unlimited project ideas</li>
                  <li>Unlimited published projects</li>
                  <li>Unlimited active collaborations</li>
                  <li>Advanced AI project enhancements</li>
                  <li>Early access to new features</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <p>
            Subscription fees are charged at the beginning of each billing period. You can cancel your subscription 
            at any time through your account settings, but no refunds will be provided for the current billing period.
          </p>
        </div>
      )
    },
    {
      id: 'payment',
      title: 'Payment Processing',
      content: (
        <div className="space-y-4">
          <p>
            We use third-party payment processors (Stripe and Flutterwave) to handle payments. 
            By using our paid services, you agree to comply with their terms of service as well.
          </p>
          <p>
            You are responsible for providing accurate billing information. We are not responsible for any charges 
            or fees from your financial institution related to your payments to us.
          </p>
        </div>
      )
    },
    {
      id: 'user-content',
      title: 'User Content',
      content: (
        <div className="space-y-4">
          <p>
            You retain ownership of any content you submit to the Service, including project ideas, feedback, 
            and collaboration details. However, by submitting content, you grant us a worldwide, non-exclusive, 
            royalty-free license to use, reproduce, modify, adapt, publish, and display such content in connection 
            with the Service.
          </p>
          <p>
            You agree not to submit content that:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Infringes on intellectual property rights</li>
            <li>Contains harmful or malicious code</li>
            <li>Violates any laws or regulations</li>
            <li>Contains offensive, harmful, or inappropriate material</li>
          </ul>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      content: (
        <div className="space-y-4">
          <p>
            The Service and its original content, features, and functionality are owned by Projectrix and are 
            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p>
            AI-generated project ideas provided through the Service are licensed to you for personal or commercial use, 
            but you may not claim exclusive ownership of the raw ideas themselves.
          </p>
        </div>
      )
    },
    {
      id: 'limitation',
      title: 'Limitation of Liability',
      content: (
        <div className="space-y-4">
          <p>
            In no event shall Projectrix, its directors, employees, partners, agents, suppliers, or affiliates be 
            liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
            loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your access to or use of or inability to access or use the Service</li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>Unauthorized access, use or alteration of your transmissions or content</li>
          </ul>
        </div>
      )
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      content: (
        <div className="space-y-4">
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. 
            The Service is provided without warranties of any kind, whether express or implied.
          </p>
          <p>
            We do not guarantee that:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The Service will meet your specific requirements</li>
            <li>The Service will be uninterrupted, timely, secure, or error-free</li>
            <li>The results from using the Service will be accurate or reliable</li>
            <li>The quality of any products, services, information, or other material purchased or obtained 
                through the Service will meet your expectations</li>
          </ul>
        </div>
      )
    },
    {
      id: 'third-party',
      title: 'Third-Party Links',
      content: (
        <div className="space-y-4">
          <p>
            Our Service may contain links to third-party websites or services that are not owned or controlled by Projectrix. 
            We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any 
            third-party websites or services.
          </p>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      content: (
        <div className="space-y-4">
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, 
            you may simply discontinue using the Service.
          </p>
        </div>
      )
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      content: (
        <div className="space-y-4">
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Country/State], 
            without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. 
            If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions 
            of these Terms will remain in effect.
          </p>
        </div>
      )
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      content: (
        <div className="space-y-4">
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide 
            at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be 
            determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by the 
            revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: (
        <div className="space-y-4">
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email: support@projectrix.com</li>
            <li>Twitter: @projectrix</li>
            <li>GitHub: github.com/projectrix</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <PageTransition>
      <main className="min-h-screen bg-background relative">
        <TechBackground />
        <Header />
        
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <Button 
                  variant="ghost" 
                  className="mb-6"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
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
                        Terms of
                      </span>{" "}
                      <span className="text-black dark:text-white">
                        Service
                      </span>
                      <motion.div
                        className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </span>
                  </h1>
                  <p className="text-muted-foreground">
                    Last Updated: March 10, 2025
                  </p>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-10"
              >
                <Card className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileCheck className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold mb-2">Terms Overview</h2>
                        <p className="text-muted-foreground">
                          Please read these Terms of Service ("Terms") carefully before using the Projectrix website and services.
                          By accessing or using Projectrix, you agree to be bound by these Terms and our Privacy Policy.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Table of Contents */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sections.map((section, index) => (
                      <a 
                        key={section.id}
                        href={`#${section.id}`}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <span className="text-xs font-medium text-primary">{index + 1}.</span>
                        <span>{section.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Terms Content */}
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    {sections.map((section, index) => (
                      <AccordionItem 
                        key={section.id} 
                        value={section.id}
                        id={section.id}
                        className="border border-black/10 dark:border-white/10 rounded-lg mb-4 overflow-hidden data-[state=open]:bg-white/50 dark:data-[state=open]:bg-black/50"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-black/5 dark:hover:bg-white/5">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-primary">{index + 1}</span>
                            </div>
                            <h3 className="text-lg font-medium">{section.title}</h3>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                
                {/* Final Note */}
                <div className="mt-10 p-6 bg-white/50 dark:bg-black/50 rounded-lg border border-black/10 dark:border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Final Note</h3>
                      <p className="text-muted-foreground">
                        By using Projectrix, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our service.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <Footer />
      </main>
    </PageTransition>
  );
};

export default TermsOfServicePage;