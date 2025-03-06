"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Plus, Minus, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useState } from "react"
import TechBackground from "@/components/TechBackground"
import PageTransition from "@/components/PageTransition"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const PricingPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0)
  const { user, login } = useAuth() // Using new Auth Context
  console.log("Pricing Page - Full User Object:", user)
  console.log("Pricing Page - User Plan:", user?.plan)
  console.log("Pricing Page - Project Ideas Left:", user?.projectIdeasLeft)
  const router = useRouter()

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started with project collaboration",
      price: "0",
      features: [
        "3 Project ideas per month",
        "Limited Collaboration Requests",
        "1 Active collaboration at a time",
        "1 Published project",
        "Discord channel access",
        "Community feedback submission",
        "GitHub integration",
      ],
      isCurrentPlan: user ? user.plan === "free" || !user.plan : false,
    },
    {
      name: "Pro",
      description: "For developers who want to maximize their collaboration potential",
      price: "5",
      features: [
        "Unlimited project ideas",
        "Project idea customization",
        "Unlimited active collaborations",
        "Unlimited collaboration requests",
        "Unlimited published projects",
        "Discord channels access",
        "Advanced feedback management",
        "GitHub integration",
        "Featured project showcase",
        "Advanced AI project enhancements",
        "Early access to new features",
      ],
      badge: "Most Popular",
      isCurrentPlan: user ? user.plan === "pro" : false,
    },
  ]

  // Handle plan selection or upgrade
  const handlePlanAction = async (planName: string) => {
    if (!user) {
      // If not logged in, they need to sign in first (for any plan)
      try {
        await login()
        toast.info("Please select a plan after logging in")
      } catch (error) {
        console.error("Login error:", error)
      }
      return
    }

    if (planName === "Free") {
      // For free plan, redirect to generate page
      router.push("/generate")
    } else if (planName === "Pro") {
      // For pro plan, will add payment integration later
      // For now, just show a toast
      toast.success("Payment integration coming soon!")
    }
  }

  const getPlanButtonText = (plan: any) => {
    if (!user) return "Get Started"
    if (plan.isCurrentPlan) return "Current Plan"
    return plan.name === "Free" ? "Generate Ideas" : "Upgrade Now"
  }

  const faqs = [
    {
      question: "Can I upgrade or downgrade at any time?",
      answer:
        "Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated amount for the remainder of the current billing cycle.",
    },
    {
      question: "What happens when I reach my project idea generation limit?",
      answer:
        "On the free plan, once you've used your 3 project generations, you'll need to upgrade to Pro for unlimited generations.",
    },
    {
      question: "Is there a minimum commitment period?",
      answer:
        "No, both our Free and Pro plans are month-to-month with no long-term commitment required. You can cancel at any time.",
    },
  ]

  const handleFaqToggle = (index: number): void => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index)
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background">
        <TechBackground />
        <Header />
        <section className="py-20">
          <div className="container px-4 mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron mt-12 relative inline-block">
                <span className="bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                  Simple, Transparent
                </span>{" "}
                <span className="text-black dark:text-white">Pricing</span>
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect plan for your development journey. Start for free and upgrade as you grow.
              </p>
            </motion.div>
            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group flex h-full"
                >
                  {/* Background shadow element - similar to story cards */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      plan.name === "Free"
                        ? "from-blue-600/20 to-blue-400/20 transform rotate-3"
                        : "from-blue-400/20 to-blue-600/20 transform -rotate-3"
                    } rounded-lg`}
                  />

                  <Card
                    className={`relative flex flex-col w-full transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 ${
                      plan.name === "Pro" ? "border-primary ring-2 ring-primary/20" : ""
                    }${
                      plan.isCurrentPlan ? "border-green-500 ring-2 ring-green-500/20" : ""
                    } bg-white dark:bg-black border border-black/20 dark:border-white/20`}
                  >
                    {/* Current Plan Badge - Only show if user is logged in and it's their current plan */}
                    {user && plan.isCurrentPlan && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 pt-6">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white shadow-lg">
                          <Check className="h-4 w-4" />
                          Current Plan
                        </span>
                      </div>
                    )}

                    {/* Pro Badge */}
                    {(!plan.isCurrentPlan || !user) && plan.badge && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 pt-6">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-black dark:bg-white text-white dark:text-black shadow-lg">
                          <Sparkles className="h-4 w-4" />
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <CardHeader className={plan.badge || (user && plan.isCurrentPlan) ? "pt-8" : ""}>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>
                        {plan.description}
                        {user && plan.name === "Free" && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-primary">{user.projectIdeasLeft} project ideas</span>{" "}
                            remaining this month
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 flex-grow">
                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>

                      {/* Features */}
                      <div className="space-y-3">
                        <span className="text-sm font-medium">Includes:</span>
                        <ul className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>

                    <CardFooter className="mt-auto">
                      <Button
                        className={`w-full gap-2 transform transition-all active:translate-y-1 active:shadow-none ${
                          plan.name === "Pro"
                            ? "bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)]"
                            : "bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5 shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)]"
                        }`}
                        size="lg"
                        onClick={() => handlePlanAction(plan.name)}
                        disabled={user && plan.isCurrentPlan} // Only disable if user is logged in and it's their current plan
                      >
                        {getPlanButtonText(plan)}
                        {plan.name === "Pro" && (!user || !plan.isCurrentPlan) && <Sparkles className="h-4 w-4" />}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            {/* FAQ Section */}
            <motion.div
              className="mt-20 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Background shadow element */}
                    <div className="absolute inset-0 bg-black/20 dark:bg-white/20 translate-x-1 translate-y-1 rounded-xl transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />

                    {/* Main card */}
                    <motion.div
                      className={`relative p-6 rounded-xl bg-white dark:bg-black border border-black/20 dark:border-white/20 overflow-hidden transition-all duration-300 ${
                        openFaqIndex === index ? "shadow-lg" : ""
                      }`}
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
                      {/* Floating particles */}
                      {openFaqIndex === index && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
                              animate={{
                                x: [0, Math.random() * 100 - 50],
                                y: [0, Math.random() * 100 - 50],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.3,
                              }}
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Question header */}
                      <button
                        onClick={() => handleFaqToggle(index)}
                        className="w-full flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-900/20 dark:from-blue-400/20 dark:to-blue-700/20 blur-lg rounded-full" />
                            <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-left">{faq.question}</h3>
                        </div>
                        <div className="flex-shrink-0">
                          {openFaqIndex === index ? (
                            <Minus className="w-5 h-5 text-primary" />
                          ) : (
                            <Plus className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </button>

                      {/* Answer content */}
                      <AnimatePresence>
                        {openFaqIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 pl-14">
                              <div className="relative">
                                <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-blue-600/20 via-blue-900/20 to-transparent dark:from-blue-400/20 dark:via-blue-700/20" />
                                <p className="text-muted-foreground">{faq.answer}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        
        <Footer />
      </main>
    </PageTransition>
  )
}

export default PricingPage

