'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, LockKeyhole, Eye, FileText, ChevronDown, ShieldAlert, User, Bell, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PrivacyPolicyPage = () => {
  const router = useRouter();

  // Define privacy policy sections
  const sections = [
    {
      id: 'information-collected',
      title: 'Information We Collect',
      icon: <User className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-primary/30 pl-4 py-1">
            <h3 className="text-lg font-medium mb-2">Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li className="pl-2">
                <span className="font-medium text-foreground">Account Information:</span> When you create an account through GitHub authentication, we receive 
                your GitHub profile information including your name, email address, GitHub username, and profile picture.
              </li>
              <li className="pl-2">
                <span className="font-medium text-foreground">Profile Information:</span> Additional information you choose to add to your Projectrix profile, 
                such as skills, bio, preferred technologies, and social media links.
              </li>
              <li className="pl-2">
                <span className="font-medium text-foreground">Payment Information:</span> If you subscribe to our Pro plan, we collect payment details necessary 
                to process your transaction. Full payment information is handled by our secure payment processors (Stripe or Flutterwave) 
                and not stored on our servers.
              </li>
              <li className="pl-2">
                <span className="font-medium text-foreground">Project and Collaboration Data:</span> Information related to projects you generate, save, or publish, 
                as well as collaboration requests and feedback you submit.
              </li>
            </ul>
          </div>
          
          <div className="border-l-4 border-primary/30 pl-4 py-1">
            <h3 className="text-lg font-medium mb-2">Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li className="pl-2">
                <span className="font-medium text-foreground">Usage Data:</span> Information about how you interact with our service, such as pages visited, 
                features used, and time spent on the platform.
              </li>
              <li className="pl-2">
                <span className="font-medium text-foreground">Device Information:</span> Information about the device you use to access Projectrix, including 
                device type, operating system, browser, and screen resolution.
              </li>
              <li className="pl-2">
                <span className="font-medium text-foreground">Location Information:</span> General location information based on your IP address, used for 
                determining appropriate payment methods and currency.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'information-usage',
      title: 'How We Use Your Information',
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We use the information we collect for the following purposes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10">
              <CardContent className="p-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>To provide, maintain, and improve the Projectrix platform</li>
                  <li>To process transactions and manage your account</li>
                  <li>To match you with appropriate project ideas and potential collaborators</li>
                  <li>To communicate with you about updates, support, and service-related notices</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10">
              <CardContent className="p-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>To respond to your comments, questions, and requests</li>
                  <li>To monitor and analyze usage patterns and trends</li>
                  <li>To protect the security and integrity of our platform</li>
                  <li>To enforce our Terms of Service and other policies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'information-sharing',
      title: 'How We Share Your Information',
      icon: <Bell className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We may share your information in the following circumstances:
          </p>
          <div className="space-y-3 mt-2">
            <div className="bg-primary/5 p-3 rounded-md">
              <h4 className="font-medium mb-1">With Other Users</h4>
              <p className="text-sm text-muted-foreground">
                When you publish projects or send collaboration requests, certain profile information 
                (such as your name, username, avatar, and skills) will be visible to other users. 
                You can control whether your email is shared in your profile settings.
              </p>
            </div>
            <div className="bg-primary/5 p-3 rounded-md">
              <h4 className="font-medium mb-1">Service Providers</h4>
              <p className="text-sm text-muted-foreground">
                We share information with third-party service providers who help us operate our business, 
                such as payment processors, cloud storage providers, and analytics services.
              </p>
            </div>
            <div className="bg-primary/5 p-3 rounded-md">
              <h4 className="font-medium mb-1">Legal Requirements</h4>
              <p className="text-sm text-muted-foreground">
                We may disclose your information if required to do so by law or in response to valid 
                requests by public authorities.
              </p>
            </div>
            <div className="bg-primary/5 p-3 rounded-md">
              <h4 className="font-medium mb-1">Business Transfers</h4>
              <p className="text-sm text-muted-foreground">
                If we are involved in a merger, acquisition, or sale of all or a portion of our assets, 
                your information may be transferred as part of that transaction.
              </p>
            </div>
          </div>
          <p className="text-sm font-medium mt-3">
            We do not sell your personal information to third parties.
          </p>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <ShieldAlert className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="flex gap-2 items-start bg-white/50 dark:bg-black/50 p-3 rounded-md">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <LockKeyhole className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Encryption</h4>
                <p className="text-xs text-muted-foreground">Encryption of sensitive data both in transit and at rest</p>
              </div>
            </div>
            <div className="flex gap-2 items-start bg-white/50 dark:bg-black/50 p-3 rounded-md">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Security Testing</h4>
                <p className="text-xs text-muted-foreground">Regular security assessments and vulnerability testing</p>
              </div>
            </div>
            <div className="flex gap-2 items-start bg-white/50 dark:bg-black/50 p-3 rounded-md">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Access Control</h4>
                <p className="text-xs text-muted-foreground">Access controls for our systems and databases</p>
              </div>
            </div>
            <div className="flex gap-2 items-start bg-white/50 dark:bg-black/50 p-3 rounded-md">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Staff Training</h4>
                <p className="text-xs text-muted-foreground">Employee training on data security and privacy practices</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            While we strive to protect your personal information, no method of transmission over the 
            Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </div>
      )
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We retain your personal information for as long as necessary to fulfill the purposes outlined 
            in this Privacy Policy, unless a longer retention period is required or permitted by law. 
            When determining how long to retain information, we consider:
          </p>
          <div className="pl-4 space-y-2 mt-1">
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-medium">1</span>
              </div>
              <p className="text-sm text-muted-foreground">The amount, nature, and sensitivity of the information</p>
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-medium">2</span>
              </div>
              <p className="text-sm text-muted-foreground">The potential risk of harm from unauthorized use or disclosure</p>
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-medium">3</span>
              </div>
              <p className="text-sm text-muted-foreground">The purposes for which we process the information</p>
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-medium">4</span>
              </div>
              <p className="text-sm text-muted-foreground">Whether we can achieve those purposes through other means</p>
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-medium">5</span>
              </div>
              <p className="text-sm text-muted-foreground">Applicable legal requirements</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            When you delete your account, we will delete or anonymize your personal information within 30 days, 
            except for information we need to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
            <li>Protect our legitimate business interests</li>
          </ul>
        </div>
      )
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <Card className="bg-primary/5 border-0">
              <CardContent className="p-4">
                <h4 className="text-base font-medium mb-2">Access and Portability</h4>
                <p className="text-sm text-muted-foreground">
                  You can access most of your personal information through your account settings. 
                  You may request a copy of your personal information in a structured, commonly used, 
                  and machine-readable format.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-0">
              <CardContent className="p-4">
                <h4 className="text-base font-medium mb-2">Correction</h4>
                <p className="text-sm text-muted-foreground">
                  You can update most of your personal information through your account settings. 
                  If you cannot update certain information, you can contact us to make the necessary changes.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-0">
              <CardContent className="p-4">
                <h4 className="text-base font-medium mb-2">Deletion</h4>
                <p className="text-sm text-muted-foreground">
                  You can delete your account and associated personal information at any time 
                  through your account settings or by contacting us.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-0">
              <CardContent className="p-4">
                <h4 className="text-base font-medium mb-2">Restriction and Objection</h4>
                <p className="text-sm text-muted-foreground">
                  In certain circumstances, you may have the right to restrict or object to our processing 
                  of your personal information.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We use cookies and similar tracking technologies to collect and track information about your browsing 
            activities. You can control cookies through your browser settings and other tools. However, 
            rejecting cookies may affect the functionality of our services.
          </p>
          <div className="bg-primary/5 p-4 rounded-md">
            <h4 className="text-base font-medium mb-2">What are cookies?</h4>
            <p className="text-sm text-muted-foreground">
              Cookies are small data files stored on your device that help us improve your experience on our website. 
              They allow us to remember your preferences, understand how you use our service, and provide personalized features.
            </p>
          </div>
        </div>
      )
    }
  ];

  // Define more concise sections for tab view
  const tabSections = [
    {
      id: 'general',
      title: 'General',
      sections: ['information-collected', 'information-usage', 'information-sharing']
    },
    {
      id: 'data-handling',
      title: 'Data Handling',
      sections: ['data-security', 'data-retention']
    },
    {
      id: 'user-rights',
      title: 'Your Rights',
      sections: ['your-rights', 'cookies']
    },
    {
      id: 'other',
      title: 'Other',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Children's Privacy</h3>
            <p className="text-muted-foreground">
              Our Service is not directed to children under the age of 13 (or the applicable age of digital consent 
              in your jurisdiction). We do not knowingly collect personal information from children. If you are a 
              parent or guardian and believe that your child has provided us with personal information, please 
              contact us so that we can delete such information.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">International Data Transfers</h3>
            <p className="text-muted-foreground">
              Your information may be transferred to, and processed in, countries other than the country in which 
              you are resident. These countries may have data protection laws that are different from those in your 
              country. We take appropriate safeguards to require that your personal information remains protected in 
              accordance with this Privacy Policy.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Third-Party Services</h3>
            <p className="text-muted-foreground">
              Our service may contain links to third-party websites or services that are not owned or controlled by 
              Projectrix. We are not responsible for the privacy practices of these third-party services. 
              We encourage you to review the privacy policies of any third-party services you visit.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Changes to This Privacy Policy</h3>
            <p className="text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last Updated" date. For significant changes, we will 
              provide additional notice, such as a prominent website notice or an email notification.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Contact Us</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10">
                <CardContent className="p-4 text-center">
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">privacy@projectrix.com</p>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10">
                <CardContent className="p-4 text-center">
                  <p className="font-medium">Twitter</p>
                  <p className="text-muted-foreground text-sm">@projectrix</p>
                </CardContent>
              </Card>
              <Card className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10">
                <CardContent className="p-4 text-center">
                  <p className="font-medium">GitHub</p>
                  <p className="text-muted-foreground text-sm">github.com/projectrix</p>
                </CardContent>
              </Card>
            </div>
          </div>
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
            <div className="max-w-4xl mx-auto">
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
                        Privacy
                      </span>{" "}
                      <span className="text-black dark:text-white">
                        Policy
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
              
              {/* Privacy commitment section */}
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
                        <ShieldCheck className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold mb-2">Our Privacy Commitment</h2>
                        <p className="text-muted-foreground">
                          At Projectrix, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information. 
                          We're committed to transparency and ensuring you maintain control over your data.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Dynamic content with tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    {tabSections.map((tab) => (
                      <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
                        {tab.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {tabSections.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                      {tab.content ? (
                        tab.content
                      ) : (
                        <Accordion type="single" collapsible className="w-full">
                          {sections
                            .filter((section) => tab.sections.includes(section.id))
                            .map((section) => (
                              <AccordionItem 
                                key={section.id} 
                                value={section.id}
                                className="bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg mb-4 overflow-hidden"
                              >
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      {section.icon}
                                    </div>
                                    <span className="font-medium">{section.title}</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2">
                                  {section.content}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>
              
              {/* Data control highlights at the bottom */}
              <motion.div 
                className="mt-12 grid md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex flex-col items-center text-center p-4 bg-white/50 dark:bg-black/50 rounded-lg border border-black/10 dark:border-white/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <LockKeyhole className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Secure by Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted and protected with industry-standard security measures.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 bg-white/50 dark:bg-black/50 rounded-lg border border-black/10 dark:border-white/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Transparency First</h3>
                  <p className="text-sm text-muted-foreground">
                    We're clear about what data we collect and how we use it to improve your experience.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-4 bg-white/50 dark:bg-black/50 rounded-lg border border-black/10 dark:border-white/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Your Data, Your Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Access, update, or delete your information anytime through your account settings.
                  </p>
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

export default PrivacyPolicyPage;