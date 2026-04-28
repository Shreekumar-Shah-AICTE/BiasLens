import { motion } from 'framer-motion';
import { Eye, Link2 } from 'lucide-react';
import type { HiddenProxy } from '../types';

interface Props {
  proxies: HiddenProxy[];
}

export function ProxyAlerts({ proxies }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-danger-400/10 border border-danger-400/20 flex items-center justify-center">
          <Eye className="w-4 h-4 text-danger-400" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-danger-400">Hidden Proxy Variables Detected</h3>
          <p className="text-xs text-text-muted">Variables that appear neutral but secretly correlate with protected attributes</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {proxies.map((proxy, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.15, type: 'spring', stiffness: 120 }}
            className="glass-card-danger p-5 relative overflow-hidden group"
          >
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-danger-400/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-danger-400/10 transition-all" />

            <div className="relative z-10">
              {/* Connection visualization */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/10 text-xs font-mono px-2.5 py-1 rounded-md border border-white/10">
                  {proxy.variable}
                </span>
                <Link2 className="w-3.5 h-3.5 text-danger-400 animate-pulse" />
                <span className="bg-danger-400/10 text-xs font-mono px-2.5 py-1 rounded-md border border-danger-400/20 text-danger-400">
                  {proxy.correlatesWith}
                </span>
              </div>

              {/* Correlation strength bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Correlation Strength</span>
                  <span className="text-sm font-display font-bold text-danger-400">{proxy.correlationStrength}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${proxy.correlationStrength}%` }}
                    transition={{ delay: 1 + i * 0.15, duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-danger-400 to-danger-500"
                    style={{
                      boxShadow: '0 0 10px rgba(255, 51, 102, 0.4)',
                    }}
                  />
                </div>
              </div>

              {/* Explanation */}
              <p className="text-xs text-text-secondary leading-relaxed">
                {proxy.explanation}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
