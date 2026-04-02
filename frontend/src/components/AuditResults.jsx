import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RefreshCcw } from 'lucide-react'; // Reset ke liye icon
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// App.jsx se 'data' (backend report) aur 'onReset' function yahan aa raha hai
export default function AuditResults({ data: auditReport, onReset }) {
  
  // Backend data format check: Agar backend se chart_data nahi aaya toh khali list rakho
  const chartData = auditReport?.chart_data || [];
  
  return (
    <div style={{ color: 'white', fontFamily: 'sans-serif', width: '100%' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
          Analysis <span style={{ color: '#3b82f6' }}>Results</span>
        </motion.h2>
        
        {/* Reset Button: Dusri file upload karne ke liye */}
        <button 
          onClick={onReset}
          style={{ 
            background: '#111827', border: '1px solid #374151', color: '#9ca3af', 
            padding: '8px 16px', borderRadius: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' 
          }}
        >
          <RefreshCcw size={16} /> New Audit
        </button>
      </div>
      
      {/* Dynamic Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {[
          { 
            label: 'Total Tax Saved', 
            val: `₹${(auditReport?.total_saved || 0).toLocaleString()}`, 
            col: '#10b981' 
          },
          { 
            label: 'Potential Savings', 
            val: auditReport?.potential ? `₹${auditReport.potential.toLocaleString()}` : '₹0', 
            col: '#3b82f6' 
          },
          { 
            label: 'Risk Score', 
            val: `${auditReport?.risk_score || 0}%`, 
            col: '#ef4444' 
          }
        ].map((item, i) => (
          <motion.div 
            key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
            style={{ background: '#111827', padding: '24px', borderRadius: '20px', border: '1px solid #374151', borderTop: `4px solid ${item.col}` }}
          >
            <p style={{ color: '#9ca3af', margin: '0 0 10px 0', fontSize: '14px' }}>{item.label}</p>
            <h2 style={{ fontSize: '28px', margin: 0 }}>{item.val}</h2>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Pie Chart */}
      <div style={{ marginTop: '30px', background: '#111827', padding: '30px', borderRadius: '20px', border: '1px solid #374151' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>AI Tax Intelligence Breakdown</h3>
        <div style={{ width: '100%', height: 350 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={chartData} 
                  cx="50%" cy="50%" 
                  innerRadius={70} outerRadius={110} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
              No breakdown data available for this audit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}