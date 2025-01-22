'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, MessageSquare, ExternalLink, ArrowRight, LucideIcon } from 'lucide-react';

// Define interfaces for our types
interface Link {
  label: string;
  href: string;
  icon?: LucideIcon;
  external?: boolean;
}

interface Section {
  title: string;
  links: Link[];
}

interface FooterSectionProps {
  title: string;
  links: Link[];
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative group"
    >
      {/* Background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-900/5 to-blue-600/5 dark:from-blue-700/5 dark:to-blue-400/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Content */}
      <div className="relative">
        <h3 className="font-semibold mb-3 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">{title}</h3>
        <ul className="space-y-2">
          {links.map((link: Link, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <a
                href={link.href}
                className="group/link flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                <span className="relative">
                  {link.label}
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 group-hover/link:w-full transition-all duration-300" />
                </span>
                {link.external && (
                  <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                )}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Footer: React.FC = () => {
  const sections: Section[] = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "How it Works", href: "#" },
        { label: "Pricing", href: "/pricing" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#", icon: ArrowRight },
        { label: "Blog", href: "#" },
        { label: "Guides", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy", href: "#" }
      ]
    },
    {
      title: "Connect",
      links: [
        { label: "Twitter", href: "#", icon: Twitter, external: true },
        { label: "GitHub", href: "#", icon: Github, external: true },
        { label: "Discord", href: "#", icon: MessageSquare, external: true }
      ]
    }
  ];

  return (
    <footer className="relative py-10 overflow-hidden border-t border-border/40">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-blue-900/[0.02] dark:bg-grid-blue-400/[0.02] bg-[size:20px_20px]" />
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {sections.map((section: Section, index: number) => (
            <FooterSection key={index} {...section} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-border/40 text-center relative"
        >
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Developed by{" "}
              <a 
                href="https://ukohgodwingeorge-portfolio.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative inline-flex items-center gap-1 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent group/dev"
              >
                Ukoh-Godwin George
                <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover/dev:opacity-100 group-hover/dev:translate-x-0 transition-all duration-300" />
                <span className="absolute left-0 bottom-0 h-px w-0 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 group-hover/dev:w-full transition-all duration-300" />
              </a>
            </p>
            <p className="text-muted-foreground">&copy; 2025 Projectrix. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;