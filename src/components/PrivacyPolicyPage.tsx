'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TechBackground from '@/components/TechBackground';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  const router = useRouter();

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
                        <Shield className="h-8 w-8 text-primary" />
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
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
              >
                <section>
                  <h2>1. Information We Collect</h2>
                  <p>
                    We collect the following types of information:
                  </p>
                  
                  <h3>1.1 Information You Provide</h3>
                  <ul>
                    <li>
                      <strong>Account Information:</strong> When you create an account through GitHub authentication, we receive 
                      your GitHub profile information including your name, email address, GitHub username, and profile picture.
                    </li>
                    <li>
                      <strong>Profile Information:</strong> Additional information you choose to add to your Projectrix profile, 
                      such as skills, bio, preferred technologies, and social media links.
                    </li>
                    <li>
                      <strong>Payment Information:</strong> If you subscribe to our Pro plan, we collect payment details necessary 
                      to process your transaction. Full payment information is handled by our secure payment processors (Stripe or Flutterwave) 
                      and not stored on our servers.
                    </li>
                    <li>
                      <strong>Project and Collaboration Data:</strong> Information related to projects you generate, save, or publish, 
                      as well as collaboration requests and feedback you submit.
                    </li>
                  </ul>
                  
                  <h3>1.2 Information Collected Automatically</h3>
                  <ul>
                    <li>
                      <strong>Usage Data:</strong> Information about how you interact with our service, such as pages visited, 
                      features used, and time spent on the platform.
                    </li>
                    <li>
                      <strong>Device Information:</strong> Information about the device you use to access Projectrix, including 
                      device type, operating system, browser, and screen resolution.
                    </li>
                    <li>
                      <strong>Location Information:</strong> General location information based on your IP address, used for 
                      determining appropriate payment methods and currency.
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h2>2. How We Use Your Information</h2>
                  <p>
                    We use the information we collect for the following purposes:
                  </p>
                  <ul>
                    <li>To provide, maintain, and improve the Projectrix platform</li>
                    <li>To process transactions and manage your account</li>
                    <li>To match you with appropriate project ideas and potential collaborators</li>
                    <li>To communicate with you about updates, support, and service-related notices</li>
                    <li>To respond to your comments, questions, and requests</li>
                    <li>To monitor and analyze usage patterns and trends to improve user experience</li>
                    <li>To protect the security and integrity of our platform</li>
                    <li>To enforce our Terms of Service and other policies</li>
                  </ul>
                </section>
                
                <section>
                  <h2>3. How We Share Your Information</h2>
                  <p>
                    We may share your information in the following circumstances:
                  </p>
                  <ul>
                    <li>
                      <strong>With Other Users:</strong> When you publish projects or send collaboration requests, 
                      certain profile information (such as your name, username, avatar, and skills) will be visible 
                      to other users. You can control whether your email is shared in your profile settings.
                    </li>
                    <li>
                      <strong>Service Providers:</strong> We share information with third-party service providers 
                      who help us operate our business, such as payment processors, cloud storage providers, and 
                      analytics services.
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> We may disclose your information if required to do so by 
                      law or in response to valid requests by public authorities.
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of 
                      all or a portion of our assets, your information may be transferred as part of that transaction.
                    </li>
                    <li>
                      <strong>With Your Consent:</strong> We may share your information for other purposes with your 
                      explicit consent.
                    </li>
                  </ul>
                  <p>
                    We do not sell your personal information to third parties.
                  </p>
                </section>
                
                <section>
                  <h2>4. Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul>
                    <li>Encryption of sensitive data both in transit and at rest</li>
                    <li>Regular security assessments and vulnerability testing</li>
                    <li>Access controls for our systems and databases</li>
                    <li>Employee training on data security and privacy practices</li>
                  </ul>
                  <p>
                    While we strive to protect your personal information, no method of transmission over the 
                    Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                  </p>
                </section>
                
                <section>
                  <h2>5. Data Retention</h2>
                  <p>
                    We retain your personal information for as long as necessary to fulfill the purposes outlined 
                    in this Privacy Policy, unless a longer retention period is required or permitted by law. 
                    When determining how long to retain information, we consider:
                  </p>
                  <ul>
                    <li>The amount, nature, and sensitivity of the information</li>
                    <li>The potential risk of harm from unauthorized use or disclosure</li>
                    <li>The purposes for which we process the information</li>
                    <li>Whether we can achieve those purposes through other means</li>
                    <li>Applicable legal requirements</li>
                  </ul>
                  <p>
                    When you delete your account, we will delete or anonymize your personal information within 30 days, 
                    except for information we need to:
                  </p>
                  <ul>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                    <li>Enforce our agreements</li>
                    <li>Protect our legitimate business interests</li>
                  </ul>
                </section>
                
                <section>
                  <h2>6. Your Rights and Choices</h2>
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul>
                    <li>
                      <strong>Access and Portability:</strong> You can access most of your personal information through your 
                      account settings. You may request a copy of your personal information in a structured, commonly used, 
                      and machine-readable format.
                    </li>
                    <li>
                      <strong>Correction:</strong> You can update most of your personal information through your account settings. 
                      If you cannot update certain information, you can contact us to make the necessary changes.
                    </li>
                    <li>
                      <strong>Deletion:</strong> You can delete your account and associated personal information at any time 
                      through your account settings or by contacting us.
                    </li>
                    <li>
                      <strong>Restriction and Objection:</strong> In certain circumstances, you may have the right to restrict 
                      or object to our processing of your personal information.
                    </li>
                    <li>
                      <strong>Withdrawal of Consent:</strong> If we process your information based on your consent, you can 
                      withdraw that consent at any time.
                    </li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us using the information provided in the "Contact Us" section.
                  </p>
                </section>
                
                <section>
                  <h2>7. Children's Privacy</h2>
                  <p>
                    Our Service is not directed to children under the age of 13 (or the applicable age of digital consent 
                    in your jurisdiction). We do not knowingly collect personal information from children. If you are a 
                    parent or guardian and believe that your child has provided us with personal information, please 
                    contact us so that we can delete such information.
                  </p>
                </section>
                
                <section>
                  <h2>8. International Data Transfers</h2>
                  <p>
                    Your information may be transferred to, and processed in, countries other than the country in which 
                    you are resident. These countries may have data protection laws that are different from those in your 
                    country. We take appropriate safeguards to require that your personal information remains protected in 
                    accordance with this Privacy Policy.
                  </p>
                </section>
                
                <section>
                  <h2>9. Cookies and Tracking Technologies</h2>
                  <p>
                    We use cookies and similar tracking technologies to collect and track information about your browsing 
                    activities. You can control cookies through your browser settings and other tools. However, 
                    rejecting cookies may affect the functionality of our services.
                  </p>
                </section>
                
                <section>
                  <h2>10. Third-Party Services</h2>
                  <p>
                    Our service may contain links to third-party websites or services that are not owned or controlled by 
                    Projectrix. We are not responsible for the privacy practices of these third-party services. 
                    We encourage you to review the privacy policies of any third-party services you visit.
                  </p>
                </section>
                
                <section>
                  <h2>11. Changes to This Privacy Policy</h2>
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
                    new Privacy Policy on this page and updating the "Last Updated" date. For significant changes, we will 
                    provide additional notice, such as a prominent website notice or an email notification.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically for any changes. Your continued use of 
                    the Service after any changes to this Privacy Policy constitutes your acceptance of such changes.
                  </p>
                </section>
                
                <section>
                  <h2>12. Contact Us</h2>
                  <p>
                    If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <ul>
                    <li>Email: privacy@projectrix.com</li>
                    <li>Twitter: @projectrix</li>
                    <li>GitHub: github.com/projectrix</li>
                  </ul>
                </section>
                
                {/* Data control highlights at the bottom */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Secure by Design</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data is encrypted and protected with industry-standard security measures.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Transparency First</h3>
                    <p className="text-sm text-muted-foreground">
                      We're clear about what data we collect and how we use it to improve your experience.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Your Data, Your Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Access, update, or delete your information anytime through your account settings.
                    </p>
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

export default PrivacyPolicyPage;