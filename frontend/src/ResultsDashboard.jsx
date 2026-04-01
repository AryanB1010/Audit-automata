import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2 } from 'lucide-react';

// Animation Variants for the "Staggered Reveal"
const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each card appears 0.1s after the previous one
      delayChildren: 0.3,
    },
  },
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function ResultsDashboard({ data, onRestart }) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header with Motion */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-12"
      >
        <div>
          <button onClick={onRestart} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Upload
          </button>
          <h1 className="text-3xl font-bold">Audit <span className="text-blue-500">Intelligence</span> Report</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </motion.div>

      {/* The Staggered Grid */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Card 1: Total Savings (Person 3's content inside your motion wrapper) */}
        <motion.div variants={itemVars} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl">
          <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">Total Deductions Found</p>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl font-bold mt-4 text-green-400"
          >
             ₹1,45,200
          </motion.h2>
        </motion.div>

        {/* Card 2: Risk Meter */}
        <motion.div variants={itemVars} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl md:col-span-2">
           <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl">
             {/* Person 3 will put their Recharts Gauge here */}
             <span className="text-slate-600 font-mono italic">Visualizing Risk Compliance...</span>
           </div>
        </motion.div>

        {/* Card 3: Flagged Transactions Table */}
        <motion.div variants={itemVars} className="md:col-span-3 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
           <h3 className="text-lg font-semibold mb-4">Agent Logic Breakdown</h3>
           <div className="space-y-4">
             {[1, 2, 3].map((_, i) => (
               <div key={i} className="h-12 bg-slate-800/30 rounded-lg animate-pulse" />
             ))}
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
}