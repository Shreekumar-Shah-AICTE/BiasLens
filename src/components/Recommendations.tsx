import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight } from 'lucide-react';
import type { Recommendation } from '../types';

interface Props {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: Props) {
  const sorted = [...recommendations].sort((a, b) => a.priority - b.priority);

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'LOW': return 'text-success-400 bg-success-400/10 border-success-400/20';
      case 'MEDIUM': return 'text-warn-400 bg-warn-400/10 border-warn-400/20';
      case 'HIGH': return 'text-danger-400 bg-danger-400/10 border-danger-400/20';
      default: return 'text-text-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <CheckCircle className="w-4 h-4 text-success-400" />
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest">Recommended Actions</h3>
      </div>

      <div className="space-y-3">
        {sorted.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 + i * 0.1 }}
            className="flex gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 transition-all group"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-cyan-400">{rec.priority}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1 group-hover:text-cyan-400 transition-colors">{rec.action}</p>
              <p className="text-xs text-text-muted flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-success-400" />
                {rec.impact}
              </p>
            </div>
            <span className={`flex-shrink-0 text-[10px] font-mono px-2 py-0.5 rounded border self-start ${getEffortColor(rec.effort)}`}>
              {rec.effort}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
