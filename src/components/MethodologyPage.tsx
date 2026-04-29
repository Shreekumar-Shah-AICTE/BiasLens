import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Scale, Eye, BarChart3, Target, ShieldCheck, Brain } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function MethodologyPage({ onBack }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-4rem)] px-6 py-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="text-sm text-text-muted hover:text-text-primary transition-colors mb-8 inline-flex items-center gap-1.5 font-mono"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>

        {/* Title */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Methodology & <span className="text-cyan-400">AI Ethics</span>
            </h1>
          </div>
          <p className="text-text-secondary max-w-2xl text-lg">
            How BiasLens detects and measures algorithmic bias using established fairness research.
          </p>
        </motion.div>

        {/* ─── WHY BIAS DETECTION MATTERS ─── */}
        <motion.section {...fadeIn} transition={{ delay: 0.2 }} className="glass-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-danger-400" />
            <h2 className="font-display text-xl font-bold">Why Bias Detection Matters</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            Automated decision systems are increasingly used to make high-stakes choices about people's lives — from hiring
            and lending to healthcare triage. When these systems learn from historical data, they can <strong className="text-text-primary">inherit and amplify
            existing societal biases</strong>, creating feedback loops that disproportionately harm marginalized groups.
          </p>
          <p className="text-text-secondary leading-relaxed">
            The EU AI Act (2024), the U.S. Algorithmic Accountability Act, and the NIST AI Risk Management Framework
            all emphasize the need for systematic bias auditing. BiasLens makes this accessible to organizations of any size.
          </p>
        </motion.section>

        {/* ─── FAIRNESS METRICS ─── */}
        <motion.section {...fadeIn} transition={{ delay: 0.3 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display text-xl font-bold">Fairness Metrics Explained</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <BarChart3 className="w-4 h-4 text-cyan-400" />,
                title: 'Statistical Parity',
                desc: 'All demographic groups should receive positive outcomes at roughly equal rates, regardless of group membership.',
                cite: 'Dwork et al., 2012',
              },
              {
                icon: <Target className="w-4 h-4 text-success-400" />,
                title: 'Equal Opportunity',
                desc: 'Qualified individuals from all groups should have equal probability of being correctly identified as qualified.',
                cite: 'Hardt, Price & Srebro, 2016',
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-warn-400" />,
                title: 'Predictive Parity',
                desc: 'Among those predicted positive, the actual positive rate should be equal across groups.',
                cite: 'Chouldechova, 2017',
              },
              {
                icon: <Eye className="w-4 h-4 text-danger-400" />,
                title: 'Individual Fairness',
                desc: 'Similar individuals should receive similar outcomes, regardless of their group membership.',
                cite: 'Dwork et al., 2012',
              },
            ].map((metric) => (
              <motion.div
                key={metric.title}
                whileHover={{ scale: 1.01 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  {metric.icon}
                  <h3 className="font-display font-bold text-sm">{metric.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{metric.desc}</p>
                <p className="text-[10px] font-mono text-text-muted">Reference: {metric.cite}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── HIDDEN PROXY DETECTION ─── */}
        <motion.section {...fadeIn} transition={{ delay: 0.4 }} className="glass-card-danger p-8 mb-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-danger-400" />
            <h2 className="font-display text-xl font-bold text-danger-400">Hidden Proxy Variables</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            A proxy variable is a seemingly neutral input that <strong className="text-text-primary">secretly correlates with a
            protected attribute</strong>. For example:
          </p>
          <div className="space-y-2 mb-4">
            {[
              { proxy: 'Zip Code', target: 'Race/Ethnicity', why: 'Residential segregation means zip codes often predict racial demographics.' },
              { proxy: 'University Name', target: 'Socioeconomic Status', why: 'Admission to elite universities correlates strongly with family wealth.' },
              { proxy: 'Name', target: 'Gender/Ethnicity', why: 'Names carry statistical signals about gender and ethnic background.' },
            ].map((example) => (
              <div key={example.proxy} className="flex items-start gap-3 p-3 bg-dark-950/50 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 border border-white/10">{example.proxy}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-danger-400">→ {example.target}</span>
                  <p className="text-xs text-text-muted mt-1">{example.why}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            BiasLens uses Google Gemini's reasoning capabilities to identify non-obvious proxy correlations that would
            require deep domain expertise to discover manually.
          </p>
        </motion.section>

        {/* ─── HOW BIASLENS WORKS ─── */}
        <motion.section {...fadeIn} transition={{ delay: 0.5 }} className="glass-card p-8 mb-8">
          <h2 className="font-display text-xl font-bold mb-6">How BiasLens Works</h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Scenario Ingestion', desc: 'The user selects a pre-built scenario or uploads a custom CSV dataset. Column names, data types, and sample values are extracted.' },
              { step: '02', title: 'Sensitive Column Detection', desc: 'Our parser auto-detects columns likely to contain protected attributes (gender, race, age, income, location) using pattern matching.' },
              { step: '03', title: 'AI-Powered Analysis', desc: 'A carefully engineered system prompt sends the dataset metadata to Google Gemini 2.5 Flash, which returns structured JSON analysis.' },
              { step: '04', title: 'Structured Output', desc: 'Gemini returns a strict JSON schema with fairness scores, bias details, proxy variables, demographic impact data, and recommendations.' },
              { step: '05', title: 'Visual Dashboard', desc: 'Results are rendered into interactive charts (radar, bar), animated gauges, proxy alert cards, and a prioritized recommendation list.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-cyan-400">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── ACADEMIC REFERENCES ─── */}
        <motion.section {...fadeIn} transition={{ delay: 0.6 }} className="mb-12">
          <h2 className="font-display text-xl font-bold mb-4">Academic References</h2>
          <div className="space-y-3">
            {[
              'Hardt, M., Price, E., & Srebro, N. (2016). Equality of Opportunity in Supervised Learning. NeurIPS.',
              'Chouldechova, A. (2017). Fair Prediction with Disparate Impact: A Study of Bias in Recidivism Prediction Instruments. Big Data.',
              'Dwork, C., Hardt, M., Pitassi, T., Reingold, O., & Zemel, R. (2012). Fairness Through Awareness. ITCS.',
              'Barocas, S. & Selbst, A.D. (2016). Big Data\'s Disparate Impact. California Law Review.',
              'Mehrabi, N., Morstatter, F., Saxena, N., Lerman, K., & Galstyan, A. (2021). A Survey on Bias and Fairness in Machine Learning. ACM Computing Surveys.',
            ].map((ref, i) => (
              <p key={i} className="text-xs text-text-muted font-mono leading-relaxed pl-4 border-l-2 border-white/10">
                {ref}
              </p>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
