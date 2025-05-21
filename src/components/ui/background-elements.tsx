
import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundElementsProps {
  variant?: 'default' | 'light' | 'minimal';
  className?: string;
}

export function BackgroundElements({ 
  variant = 'default',
  className
}: BackgroundElementsProps) {
  // Display different elements based on the variant
  if (variant === 'minimal') {
    return (
      <div className={`fixed inset-0 -z-10 ${className}`}>
        <div className="absolute inset-0 subtle-mesh" />
      </div>
    );
  }
  
  if (variant === 'light') {
    return (
      <div className={`fixed inset-0 -z-10 ${className}`}>
        <div className="absolute inset-0 bg-soft-blue" />
        <div className="absolute inset-0 light-particles opacity-30" />
      </div>
    );
  }
  
  // Default variant with animated elements
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <div className="absolute inset-0 subtle-mesh" />
      
      {/* Animated gradient blobs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 subtle-pattern opacity-30" />
    </div>
  );
}

export default BackgroundElements;
