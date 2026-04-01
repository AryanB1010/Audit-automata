import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IngestionHero from "./components/IngestionHero";
import { AgentTerminal } from './components/Terminal/AgentTerminal';
import ResultsDashboard from './components/dashboard/ResultsDashboard';

export default function App() {
  const [stage, setStage] = useState('idle'); // idle | processing | results
  const [reportData, setReportData] = useState(null);
  const [logs, setLogs] = useState([
    { agent: 'system', message: 'Initializing Multi-Agent Environment...', timestamp: '10:45:01' },
    { agent: 'scanner', message: 'Bank Statement detected. Parsing 152 rows...', timestamp: '10:45:03' },
  ]);

  const startAnalysis = (file) => {
    setStage('processing');
    // In a real app, fetch(backend) happens here.
    // After backend returns JSON, setReportData(json) and setStage('results')
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {stage === 'idle' && (
          <motion.div
            key="idle"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <IngestionHero onFileAccepted={startAnalysis} />
          </motion.div>
        )}

        {stage === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="pt-20"
          >
            <AgentTerminal logs={logs} onComplete={() => setStage('results')} />
          </motion.div>
        )}

        {stage === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsDashboard data={reportData} onRestart={() => setStage('idle')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
