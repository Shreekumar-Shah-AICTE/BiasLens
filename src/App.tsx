import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Scan, ArrowRight, Eye, ChevronDown, Upload, KeyRound, RotateCcw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { scenarios } from './lib/scenarios';
import { analyzeBias } from './lib/gemini';
import type { BiasAnalysis, Scenario } from './types';
import { FairnessGauge } from './components/FairnessGauge';
import { BiasBreakdown } from './components/BiasBreakdown';
import { ProxyAlerts } from './components/ProxyAlerts';
import { Recommendations } from './components/Recommendations';
import { DemographicChart } from './components/DemographicChart';
import { ScanningOverlay } from './components/ScanningOverlay';
import { CsvUploader } from './components/CsvUploader';
import { ExportButton } from './components/ExportButton';

type AppState = 'hero' | 'select' | 'csv-upload' | 'scanning' | 'results';

const API_KEY_STORAGE = 'biaslens_gemini_key';

function App() {
  const [appState, setAppState] = useState<AppState>('hero');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [analysis, setAnalysis] = useState<BiasAnalysis | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [showApiInput, setShowApiInput] = useState(false);

  const handleStart = () => {
    if (!apiKey) {
      setShowApiInput(true);
      return;
    }
    setAppState('select');
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
      setShowApiInput(false);
      setAppState('select');
      toast.success('API key saved');
    }
  };

  const resetApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
    setAppState('hero');
    setShowApiInput(true);
    toast('API key cleared', { icon: '🔑' });
  };

  const handleAnalyze = async (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setAppState('scanning');

    try {
      const result = await analyzeBias(apiKey, scenario.prompt);
      setAnalysis(result);
      setTimeout(() => setAppState('results'), 1500);
    } catch (err) {
      console.error('Analysis failed:', err);
      toast.error('Analysis failed. Check your API key and try again.');
      setAppState('select');
    }
  };

  const handleCsvAnalyze = async (prompt: string) => {
    setSelectedScenario({
      id: 'custom',
      title: 'Custom Dataset',
      icon: '📊',
      domain: 'User Upload',
      description: 'User-provided dataset',
      datasetInfo: 'Custom CSV',
      prompt,
    });
    setAppState('scanning');

    try {
      const result = await analyzeBias(apiKey, prompt);
      setAnalysis(result);
      setTimeout(() => setAppState('results'), 1500);
    } catch (err) {
      console.error('Analysis failed:', err);
      toast.error('Analysis failed. Check your API key and try again.');
      setAppState('csv-upload');
    }
  };

  const handleReset = () => {
    setAppState('select');
    setSelectedScenario(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-dark-950 relative">
      {/* Toast provider */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(16, 16, 28, 0.95)',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            fontSize: '13px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          success: {
            iconTheme: { primary: '#00e676', secondary: '#05050a' },
          },
          error: {
            iconTheme: { primary: '#ff3366', secondary: '#05050a' },
          },
        }}
      />

      {/* Ambient glow orbs */}
      <div className="ambient-glow bg-cyan-400 top-[-200px] left-[-200px]" />
      <div className="ambient-glow bg-danger-400 bottom-[-200px] right-[-200px]" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => { setAppState('hero'); setSelectedScenario(null); setAnalysis(null); }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <Eye className="w-4 h-4 text-dark-950" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">BiasLens</span>
            <span className="text-[10px] font-mono text-cyan-400/60 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">AI AUDITOR</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-secondary font-mono hidden sm:block">SDG 10 — Reduced Inequalities</span>
            {apiKey && (
              <button
                onClick={resetApiKey}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-warn-400 transition-colors font-mono bg-white/5 hover:bg-warn-400/10 border border-white/10 hover:border-warn-400/20 rounded-lg px-3 py-1.5"
                title="Reset API Key"
              >
                <KeyRound className="w-3 h-3" />
                <span className="hidden sm:inline">Reset Key</span>
              </button>
            )}
            <div className="w-2 h-2 rounded-full bg-success-400 pulse-dot" />
          </div>
        </div>
      </nav>

      <main className="pt-16 relative z-10">
        <AnimatePresence mode="wait">
          {/* ═══ HERO STATE ═══ */}
          {appState === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="mb-8"
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-danger-400/20 border border-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <Shield className="w-12 h-12 text-cyan-400" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-display text-6xl md:text-7xl font-bold mb-4 tracking-tight"
              >
                Bias<span className="text-cyan-400">Lens</span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-xl md:text-2xl text-text-secondary max-w-2xl mb-3 font-light"
              >
                AI that audits AI.
              </motion.p>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="text-base text-text-muted max-w-xl mb-10"
              >
                Expose hidden discrimination in automated decision systems — before they harm real people.
                Powered by Google Gemini.
              </motion.p>

              {/* API Key Modal */}
              <AnimatePresence>
                {showApiInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="glass-card p-6 mb-6 w-full max-w-md"
                  >
                    <label className="block text-sm text-text-secondary mb-2 font-mono">Gemini API Key</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIza..."
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-text-primary focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
                    />
                    <p className="text-[10px] text-text-muted mt-2 font-mono">
                      Free at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-cyan-400/70 hover:text-cyan-400 underline">aistudio.google.com/apikey</a> • Stored locally, never shared
                    </p>
                    <button
                      onClick={saveApiKey}
                      className="mt-3 w-full bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 rounded-lg py-2.5 text-sm font-medium transition-all"
                    >
                      Save & Continue
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={handleStart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-dark-950 font-display font-bold text-lg px-10 py-4 rounded-xl shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 transition-all"
              >
                <Scan className="w-5 h-5" />
                Begin Bias Audit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 animate-bounce"
              >
                <ChevronDown className="w-5 h-5 text-text-muted" />
              </motion.div>
            </motion.div>
          )}

          {/* ═══ SCENARIO SELECTION STATE ═══ */}
          {appState === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="min-h-[calc(100vh-4rem)] px-6 py-16"
            >
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                    Select a <span className="text-cyan-400">System</span> to Audit
                  </h2>
                  <p className="text-text-secondary max-w-lg mx-auto">
                    Choose a pre-built scenario or upload your own dataset for analysis.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {scenarios.map((scenario, index) => (
                    <motion.button
                      key={scenario.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnalyze(scenario)}
                      className="glass-card p-8 text-left group cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-5xl mb-4">{scenario.icon}</div>
                      <h3 className="font-display text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">
                        {scenario.title}
                      </h3>
                      <p className="text-xs font-mono text-cyan-400/60 mb-3">{scenario.domain}</p>
                      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                        {scenario.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted font-mono">{scenario.datasetInfo}</span>
                        <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  ))}

                  {/* Custom CSV Upload Card */}
                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setAppState('csv-upload')}
                    className="glass-card p-8 text-left group cursor-pointer border-dashed border-2 border-white/10 hover:border-cyan-400/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                      <Upload className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">
                      Your Own Data
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/60 mb-3">Custom Upload</p>
                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                      Upload your own CSV dataset. We'll auto-detect sensitive columns and build a custom bias audit.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted font-mono">CSV • Max 10MB</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ CSV UPLOAD STATE ═══ */}
          {appState === 'csv-upload' && (
            <motion.div
              key="csv-upload"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="min-h-[calc(100vh-4rem)] px-6 py-16"
            >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <button
                    onClick={() => setAppState('select')}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors mb-6 inline-flex items-center gap-1.5 font-mono"
                  >
                    <RotateCcw className="w-3 h-3" /> Back to scenarios
                  </button>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                    Upload <span className="text-cyan-400">Your Dataset</span>
                  </h2>
                  <p className="text-text-secondary max-w-lg mx-auto">
                    Drop a CSV file and our AI will detect potential biases, hidden proxy variables, and demographic disparities.
                  </p>
                </div>

                <CsvUploader onAnalyze={handleCsvAnalyze} />
              </div>
            </motion.div>
          )}

          {/* ═══ SCANNING STATE ═══ */}
          {appState === 'scanning' && selectedScenario && (
            <ScanningOverlay key="scanning" scenario={selectedScenario} />
          )}

          {/* ═══ RESULTS STATE ═══ */}
          {appState === 'results' && analysis && selectedScenario && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="px-6 py-10"
            >
              <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{selectedScenario.icon}</span>
                      <h2 className="font-display text-2xl md:text-3xl font-bold">
                        {selectedScenario.title} — <span className="text-danger-400">Audit Report</span>
                      </h2>
                    </div>
                    <p className="text-text-secondary text-sm max-w-xl">{analysis.summary}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExportButton
                      analysis={analysis}
                      scenarioTitle={selectedScenario.title}
                      scenarioIcon={selectedScenario.icon}
                    />
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap"
                    >
                      <Scan className="w-4 h-4" /> New Audit
                    </button>
                  </div>
                </div>

                {/* Top Row: Gauge + Severity + Metrics */}
                <div id="bias-dashboard" className="grid md:grid-cols-12 gap-6 mb-6">
                  <div className="md:col-span-4">
                    <FairnessGauge score={analysis.overallFairnessScore} severity={analysis.severityLevel} />
                  </div>
                  <div className="md:col-span-8">
                    <BiasBreakdown biases={analysis.biasesDetected} metrics={analysis.fairnessMetrics} />
                  </div>
                </div>

                {/* Middle Row: Hidden Proxies */}
                {analysis.hiddenProxies && analysis.hiddenProxies.length > 0 && (
                  <div className="mb-6">
                    <ProxyAlerts proxies={analysis.hiddenProxies} />
                  </div>
                )}

                {/* Bottom Row: Demographics + Recommendations */}
                <div className="grid md:grid-cols-2 gap-6">
                  {analysis.demographicImpact && analysis.demographicImpact.length > 0 && (
                    <DemographicChart demographics={analysis.demographicImpact} />
                  )}
                  {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <Recommendations recommendations={analysis.recommendations} />
                  )}
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-12 text-center border-t border-white/5 pt-8 pb-6"
                >
                  <p className="text-xs text-text-muted font-mono">
                    BiasLens • Powered by Google Gemini • UN SDG 10: Reduced Inequalities
                  </p>
                  <p className="text-xs text-text-muted/50 mt-1">
                    Built by Team O(1) for Google Solution Challenge 2026
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
