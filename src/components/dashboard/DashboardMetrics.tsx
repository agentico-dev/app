
import React from 'react';
import { Briefcase, AppWindow, Server, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetricCard } from './MetricCard';
import { DashboardMetrics } from '@/hooks/useDashboardMetrics';

// Animation variants for staggered children animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    } 
  }
};

interface DashboardMetricsGridProps {
  metrics: DashboardMetrics;
}

export function DashboardMetricsGrid({ metrics }: DashboardMetricsGridProps) {
  return (
    <motion.div 
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <MetricCard
          title="Projects"
          value={metrics.projects.count.toString()}
          description="Total projects"
          icon={Briefcase}
          trend={metrics.projects.trend}
          trendUp={metrics.projects.trendUp}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <MetricCard
          title="Applications"
          value={metrics.applications.count.toString()}
          description="Deployed applications"
          icon={AppWindow}
          trend={metrics.applications.trend}
          trendUp={metrics.applications.trendUp}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <MetricCard
          title="Servers"
          value={metrics.servers.count.toString()}
          description="Active servers"
          icon={Server}
          trend={metrics.servers.trend}
          trendUp={metrics.servers.trendUp}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <MetricCard
          title="Tools"
          value={metrics.aiTools.count.toString()}
          description="Total AI tools"
          icon={Wrench}
          trend={metrics.aiTools.trend}
          trendUp={metrics.aiTools.trendUp}
        />
      </motion.div>
    </motion.div>
  );
}
