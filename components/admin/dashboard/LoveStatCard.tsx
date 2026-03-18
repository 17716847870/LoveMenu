import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoveStatCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  theme?: string;
  className?: string;
}

export default function LoveStatCard({
  title,
  value,
  trend,
  icon: Icon,
  className,
}: LoveStatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-[var(--radius-lg)] p-6 shadow-sm border bg-[var(--card)] text-[var(--card-foreground)] transition-all",
        "border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)]">{title}</h3>
        <div className="p-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold">{value}</div>
        
        {trend !== 'neutral' && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            trend === 'up' ? "text-green-500" : "text-rose-500"
          )}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {trend === 'up' ? '+12%' : '-5%'}
          </div>
        )}
      </div>
    </motion.div>
  );
}
