import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Sparkles, Users, Github, Code2, LucideIcon } from 'lucide-react';

// Define interfaces
interface FAQ {
  question: string;
  answer: string;
}

interface FAQItemProps {
  faq: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

type IconMapping = {
  [key: string]: LucideIcon;
};

const FAQItem: React.FC<FAQItemProps> = ({ faq, index, isOpen, onToggle }) => {
  const icons: IconMapping = {
    'How does the project idea generation work?': Sparkles,
    'Can I collaborate with developers from anywhere?': Users,
    'Is GitHub integration required?': Github,
    'How do I find the right collaborators?': Code2,
  };

  const Icon = icons[faq.question];

  return (
    <motion.div
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
          isOpen ? 'shadow-lg' : ''
        }`}
        whileHover={{ scale: 1.02 }}
        layout
      >
        {/* Floating particles */}
        {isOpen && (
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
                  repeat: Infinity,
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
          onClick={() => onToggle(index)}
          className="w-full flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-900/20 dark:from-blue-400/20 dark:to-blue-700/20 blur-lg rounded-full" />
              <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-left">{faq.question}</h3>
          </div>
          <div className="flex-shrink-0">
            {isOpen ? (
              <Minus className="w-5 h-5 text-primary" />
            ) : (
              <Plus className="w-5 h-5 text-primary" />
            )}
          </div>
        </button>

        {/* Answer content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
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
  );
};

const EnhancedFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs: FAQ[] = [
    {
      question: "How does the project idea generation work?",
      answer: "Our AI-powered system analyzes your selected technologies and preferences to generate relevant and exciting project ideas tailored to your skills and interests."
    },
    {
      question: "Can I collaborate with developers from anywhere?",
      answer: "Yes! Projectrix connects you with developers worldwide. You can find collaborators based on shared interests, time zones, and technology preferences."
    },
    {
      question: "Is GitHub integration required?",
      answer: "Yes, we use GitHub for authentication and profile information. This helps us create a more secure and reliable development environment."
    },
    {
      question: "How do I find the right collaborators?",
      answer: "You can browse developer profiles, filter by skills and interests, and connect with potential collaborators directly through our platform."
    }
  ];

  const handleToggle = (index: number): void => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          faq={faq}
          index={index}
          isOpen={openIndex === index}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

export default EnhancedFAQ;