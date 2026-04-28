import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  score: number;
  severity: string;
}

export function FairnessGauge({ score, severity }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = () => {
    if (score <= 30) return '#ff3366';
    if (score <= 50) return '#ff6432';
    if (score <= 70) return '#ffaa00';
    return '#00e676';
  };

  const getSeverityClass = () => {
    switch (severity) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MODERATE': return 'badge-moderate';
      case 'LOW': return 'badge-low';
      default: return 'badge-moderate';
    }
  };

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring' }}
      className="glass-card p-8 flex flex-col items-center justify-center h-full"
    >
      <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-6">Fairness Score</h3>

      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Animated fill */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{
              filter: `drop-shadow(0 0 10px ${getColor()}50)`,
              transition: 'stroke-dashoffset 0.1s ease-out',
            }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl font-bold" style={{ color: getColor() }}>
            {animatedScore}
          </span>
          <span className="text-xs text-text-muted mt-1">/100</span>
        </div>
      </div>

      <div className="mt-6">
        <span className={`${getSeverityClass()} px-4 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider`}>
          {severity} BIAS
        </span>
      </div>
    </motion.div>
  );
}
