import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Cpu, AlertCircle } from 'lucide-react';

const AGENT_CONFIG = {
  scanner: { color: 'text-yellow-400', icon: Search, label: 'SCANNER_AGENT' },
  legal: { color: 'text-blue-400', icon: ShieldCheck, label: 'LEGAL_AGENT' },
  auditor: { color: 'text-green-400', icon: Cpu, label: 'AUDITOR_AGENT' },
  system: { color: 'text-slate-500', icon: AlertCircle, label: 'SYS_TRACE' },
};

export const TerminalLog = ({ agent, message, timestamp }) => {
  const config = AGENT_CONFIG[agent] || AGENT_CONFIG.system;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      className="flex items-start gap-3 py-1 font-mono text-sm border-l border-slate-800 ml-2 pl-4 relative"
    >
      {/* Connector Dot */}
      <div className={`absolute left-[-4.5px] top-3 w-2 h-2 rounded-full border border-black ${config.color.replace('text', 'bg')}`} />
      
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold tracking-tighter ${config.color}`}>
            [{config.label}]
          </span>
          <span className="text-[10px] text-slate-600 font-bold">{timestamp}</span>
        </div>
        <p className="text-slate-300 leading-relaxed mt-0.5">{message}</p>
      </div>
    </motion.div>
  );
};