import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import type { DemographicImpact } from '../types';
import { Users } from 'lucide-react';

interface Props {
  demographics: DemographicImpact[];
}

export function DemographicChart({ demographics }: Props) {
  const avgRate = demographics.reduce((sum, d) => sum + d.approvalRate, 0) / demographics.length;

  const getBarColor = (rate: number) => {
    const diff = rate - avgRate;
    if (diff < -10) return '#ff3366';
    if (diff < -5) return '#ff6432';
    if (diff < 5) return '#ffaa00';
    return '#00e676';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Users className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Demographic Impact</h3>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={demographics} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="group"
            tick={{ fill: '#8888aa', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tick={{ fill: '#8888aa', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(10,10,18,0.95)',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value}%`, 'Approval Rate']}
          />
          <ReferenceLine
            y={avgRate}
            stroke="#00e5ff"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
            label={{
              value: `Avg: ${Math.round(avgRate)}%`,
              fill: '#00e5ff',
              fontSize: 10,
              position: 'right',
            }}
          />
          <Bar dataKey="approvalRate" radius={[4, 4, 0, 0]}>
            {demographics.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.approvalRate)} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
