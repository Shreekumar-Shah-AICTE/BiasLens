import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import type { BiasDetected, FairnessMetrics } from '../types';
import { AlertTriangle } from 'lucide-react';

interface Props {
  biases: BiasDetected[];
  metrics: FairnessMetrics;
}

export function BiasBreakdown({ biases, metrics }: Props) {
  const radarData = [
    { metric: 'Statistical Parity', value: metrics.statisticalParity },
    { metric: 'Equal Opportunity', value: metrics.equalOpportunity },
    { metric: 'Predictive Parity', value: metrics.predictiveParity },
    { metric: 'Individual Fairness', value: metrics.individualFairness },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#ff3366';
      case 'HIGH': return '#ff6432';
      case 'MODERATE': return '#ffaa00';
      case 'LOW': return '#00e676';
      default: return '#8888aa';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Bias Analysis</h3>
        <span className="text-xs font-mono text-danger-400">
          <AlertTriangle className="w-3 h-3 inline mr-1" />
          {biases.length} issues detected
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)]">
        {/* Fairness Metrics Radar */}
        <div>
          <p className="text-[10px] font-mono text-text-muted mb-2 text-center uppercase tracking-wider">Fairness Metrics</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#8888aa', fontSize: 9 }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#00e5ff"
                fill="#00e5ff"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bias Severity Bars */}
        <div>
          <p className="text-[10px] font-mono text-text-muted mb-2 text-center uppercase tracking-wider">Detected Biases</p>
          <div className="space-y-3">
            {biases.slice(0, 4).map((bias, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate">{bias.type}</span>
                    <span
                      className="text-[10px] font-mono font-semibold"
                      style={{ color: getSeverityColor(bias.severity) }}
                    >
                      {bias.severity}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bias.confidence}%` }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getSeverityColor(bias.severity) }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 truncate">{bias.metric}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
