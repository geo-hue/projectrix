import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Code2, Handshake } from 'lucide-react';

const StatItem = ({ icon: Icon, value, label, index }: {
  icon: React.ElementType;
  value: string;
  label: string; 
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative group"
    >
      {/* Main content */}
      <div className="flex items-center gap-6 p-4">
        {/* Icon container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-900/20 dark:from-blue-400/20 dark:to-blue-700/20 blur-lg rounded-full" />
          <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Text content */}
        <div>
          <motion.div 
            className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-700 dark:to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            viewport={{ once: true }}
          >
            {value}
          </motion.div>
          <p className="text-muted-foreground mt-1">{label}</p>
        </div>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-900/0 dark:from-blue-400/0 dark:via-blue-400/5 dark:to-blue-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

const EnhancedStats = () => {
  const stats = [
    { icon: Activity, value: "500+", label: "Projects Generated" },
    { icon: Users, value: "200+", label: "Active Users" },
    { icon: Code2, value: "50+", label: "Technologies" },
    { icon: Handshake, value: "100+", label: "Collaborations" }
  ];

  return (
    <div className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <StatItem key={index} {...stat} index={index} />
        ))}
      </div>
    </div>
  );
};

export default EnhancedStats;