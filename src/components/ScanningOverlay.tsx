import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { Scenario } from '../types';

interface Props {
  scenario: Scenario;
}

const scanSteps = [
  'Initializing bias detection engine...',
  'Loading dataset variables...',
  'Scanning for demographic correlations...',
  'Cross-referencing protected attributes...',
  'Detecting hidden proxy variables...',
  'Analyzing statistical parity...',
  'Computing fairness metrics...',
  'Generating audit report...',
];

export function ScanningOverlay({ scenario }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % scanSteps.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden grid-bg"
    >
      {/* Scan line */}
      <div className="scan-line" />

      {/* Pulsing center orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-48 h-48 rounded-full border border-cyan-400/20 flex items-center justify-center mb-8"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
          boxShadow: '0 0 60px rgba(0,229,255,0.1)',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full border border-cyan-400/30 flex items-center justify-center"
        >
          <span className="text-4xl">{scenario.icon}</span>
        </motion.div>
      </motion.div>

      {/* Scanning text */}
      <div className="text-center">
        <h3 className="font-display text-xl font-bold mb-2 text-cyan-400">
          Auditing {scenario.title}
        </h3>
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-sm font-mono text-text-secondary glitch-text"
        >
          {scanSteps[currentStep]}
        </motion.p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {scanSteps.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'bg-cyan-400' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-cyan-400/20 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-cyan-400/20 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-cyan-400/20 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-cyan-400/20 rounded-br-lg" />
    </motion.div>
  );
}
