import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalLog } from './TerminalLog';

export const AgentTerminal = ({ logs }) => {
  const scrollRef = useRef(null);

  // Auto-scroll logic: Keeps the latest agent thought at the bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [logs]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto mt-10 bg-[#0D0D0D] border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* Mac-style Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
          Multi-Agent Process Trace
        </div>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="h-[400px] overflow-y-auto p-6 space-y-1 scrollbar-thin scrollbar-thumb-slate-800"
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => (
            <TerminalLog key={index} {...log} />
          ))}
        </AnimatePresence>
        
        {/* Blinking Cursor for "Thinking" State */}
        <div className="flex items-center gap-2 ml-6 mt-4">
          <motion.div 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-blue-500"
          />
          <span className="text-[10px] text-slate-700 font-mono italic">
            Agents are synchronizing...
          </span>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="px-6 py-3 bg-slate-900/30 border-t border-slate-800 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 font-mono">
          STATUS: <span className="text-blue-500 animate-pulse font-bold">ACTIVE_REASONING</span>
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          V.2.0.26-ALPHA
        </span>
      </div>
    </motion.div>
  );
};