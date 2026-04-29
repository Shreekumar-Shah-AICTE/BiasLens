import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, AlertCircle, X, Sparkles } from 'lucide-react';
import { parseCsv, buildCustomPrompt } from '../lib/csvParser';
import type { CsvSummary } from '../lib/csvParser';

interface Props {
  onAnalyze: (prompt: string) => void;
}

export function CsvUploader({ onAnalyze }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [csvSummary, setCsvSummary] = useState<CsvSummary | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setParseError('Please upload a .csv file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setParseError('File size must be under 10MB.');
      return;
    }

    setIsParsing(true);
    setParseError(null);
    try {
      const summary = await parseCsv(file);
      setCsvSummary(summary);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to parse CSV.');
    } finally {
      setIsParsing(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleAnalyze = () => {
    if (!csvSummary) return;
    const prompt = buildCustomPrompt(csvSummary, context);
    onAnalyze(prompt);
  };

  const resetUpload = () => {
    setCsvSummary(null);
    setParseError(null);
    setContext('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!csvSummary ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-400/5'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              <input
                type="file"
                accept=".csv"
                onChange={onFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  isDragging ? 'bg-cyan-400/20 border-cyan-400/30' : 'bg-white/5 border-white/10'
                } border`}>
                  {isParsing ? (
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className={`w-7 h-7 ${isDragging ? 'text-cyan-400' : 'text-text-muted'}`} />
                  )}
                </div>

                <div>
                  <p className="text-lg font-medium mb-1">
                    {isDragging ? 'Drop your CSV here' : 'Upload Your Dataset'}
                  </p>
                  <p className="text-sm text-text-muted">
                    Drag & drop a CSV file, or click to browse. Max 10MB.
                  </p>
                </div>
              </div>
            </div>

            {parseError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-danger-400 text-sm flex items-center gap-2 justify-center"
              >
                <AlertCircle className="w-4 h-4" /> {parseError}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            {/* File Summary Card */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Dataset Loaded</p>
                    <p className="text-xs text-text-muted font-mono">
                      {csvSummary.totalRows} rows • {csvSummary.totalColumns} columns
                    </p>
                  </div>
                </div>
                <button onClick={resetUpload} className="text-text-muted hover:text-text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Detected Sensitive Columns */}
              {csvSummary.sensitiveColumns.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">
                    Sensitive Columns Detected
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {csvSummary.sensitiveColumns.map((s) => (
                      <span
                        key={s.column}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-danger-400/10 text-danger-400 border border-danger-400/20"
                      >
                        {s.column} <span className="text-danger-400/50">({s.category})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* All Columns */}
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">All Columns</p>
                <div className="flex flex-wrap gap-1.5">
                  {csvSummary.columns.map((col) => (
                    <span
                      key={col}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        csvSummary.sensitiveColumns.some((s) => s.column === col)
                          ? 'bg-danger-400/5 border-danger-400/20 text-danger-400/80'
                          : 'bg-white/5 border-white/10 text-text-secondary'
                      }`}
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Context Input */}
            <div className="glass-card p-5">
              <label className="block text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">
                Describe Your System (Optional)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., This dataset is from a loan approval system that processes 10,000 applications monthly..."
                rows={3}
                className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all resize-none placeholder:text-text-muted/50"
              />
            </div>

            {/* Analyze Button */}
            <motion.button
              onClick={handleAnalyze}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-dark-950 font-display font-bold text-base py-4 rounded-xl shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Analyze for Bias with Gemini
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
