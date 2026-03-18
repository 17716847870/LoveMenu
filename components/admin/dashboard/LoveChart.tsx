"use client";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface LoveChartProps {
  type: 'line' | 'pie';
  data: any[];
  title?: string;
  dataKeys?: string[];
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = ['#ff4d7d', '#ffb347', '#6366f1', '#10b981'];

export default function LoveChart({
  type,
  data,
  title,
  dataKeys,
  colors = DEFAULT_COLORS,
  className,
}: LoveChartProps) {
  return (
    <div className={cn(
      "bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col",
      className
    )}>
      {title && (
        <h3 className="text-lg font-bold mb-6 text-[var(--foreground)]">{title}</h3>
      )}
      
      <div className="w-full flex-1 relative min-h-[300px]">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--card-foreground)'
                  }}
                  formatter={(value: any, name: any) => {
                    const labelMap: Record<string, string> = {
                      interactions: '互动订单',
                      points: '积分趋势',
                      priority: '紧急想吃'
                    };
                    return [value, labelMap[String(name)] || String(name)];
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value: any) => {
                    const labelMap: Record<string, string> = {
                      interactions: '互动订单',
                      points: '积分趋势',
                      priority: '紧急想吃'
                    };
                    return labelMap[String(value)] || String(value);
                  }}
                />
                {dataKeys?.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={3}
                    dot={{ r: 4, fill: colors[index % colors.length], strokeWidth: 2, stroke: 'var(--card)' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--card-foreground)'
                  }} 
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
