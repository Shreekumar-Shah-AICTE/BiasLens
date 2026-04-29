import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, Check } from 'lucide-react';
import { generateReport } from '../lib/reportGenerator';
import type { BiasAnalysis } from '../types';
import toast from 'react-hot-toast';

interface Props {
  analysis: BiasAnalysis;
  scenarioTitle: string;
  scenarioIcon: string;
}

export function ExportButton({ analysis, scenarioTitle, scenarioIcon }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      await generateReport(analysis, scenarioTitle, scenarioIcon);
      setIsDone(true);
      toast.success('PDF report downloaded!');
      setTimeout(() => setIsDone(false), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('Failed to generate PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      onClick={handleExport}
      disabled={isGenerating}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-2 border rounded-lg px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
        isDone
          ? 'bg-success-400/10 border-success-400/30 text-success-400'
          : 'bg-cyan-400/10 hover:bg-cyan-400/20 border-cyan-400/30 text-cyan-400'
      }`}
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isDone ? (
        <Check className="w-4 h-4" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isGenerating ? 'Generating...' : isDone ? 'Downloaded!' : 'Export PDF'}
    </motion.button>
  );
}
