'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, ExternalLink } from "lucide-react";
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';


const FooterSection = ({ title, links }) => {
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
          {links.map((link, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {link.href.startsWith('http') ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span className="relative">
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 group-hover/link:w-full transition-all duration-300" />
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="group/link flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span className="relative">
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 group-hover/link:w-full transition-all duration-300" />
                  </span>
                </Link>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Footer = () => {
  const sections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Project Ideas", href: "/ideas" },
        { label: "Generate", href: "/generate" },
        { label: "Pricing", href: "/pricing" }
      ]
    },
    {
      title: "Account",
      links: [
        { label: "Profile", href: "/profile" },
        { label: "Collaborations", href: "/collaborations" },
        { label: "Feedback", href: "/feedback" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" }
      ]
    }
  ];

  return (
    <footer className="relative py-10 border-t border-border/40 bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-blue-900/[0.02] dark:bg-grid-blue-400/[0.02] bg-[size:20px_20px]" />
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold font-orbitron bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent">Projectrix</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Generate project ideas, find collaborators, and build your developer portfolio with projects that match your skills and interests.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/georgedevs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-accent transition-colors relative group/icon"
              >
                <Github className="h-5 w-5" />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 group-hover/icon:w-full transition-all duration-300" />
              </a>
              <a
                href="https://twitter.com/georgecodes"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-accent transition-colors relative group/icon"
              >
                <Twitter className="h-5 w-5" />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 group-hover/icon:w-full transition-all duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/ukoh-godwin-george/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-accent transition-colors relative group/icon"
              >
                <Linkedin className="h-5 w-5" />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 group-hover/icon:w-full transition-all duration-300" />
              </a>
              <ThemeToggle />
            </div>
          </motion.div>

          {/* Sections */}
          {sections.map((section, index) => (
            <FooterSection key={index} title={section.title} links={section.links} />
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Projectrix. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
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
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;