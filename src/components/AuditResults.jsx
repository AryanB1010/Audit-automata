import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Upload, FileText, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
  { name: 'Section 80C', value: 80000 },
  { name: 'Section 80D', value: 25000 },
  { name: 'HRA (Rent)', value: 35000 },
  { name: 'Other', value: 10000 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function App() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white', padding: '40px', fontFamily: 'sans-serif' }}>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '30px' }}>
          TaxOps <span style={{ color: '#3b82f6' }}>AI</span>
        </h1>
      </motion.div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Total Tax Saved', val: '₹45,200', col: '#10b981' },
          { label: 'Potential Savings', val: '₹1,50,000', col: '#3b82f6' },
          { label: 'Risk Score', val: '15%', col: '#ef4444' }
        ].map((item, i) => (
          <motion.div 
            key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
            style={{ background: '#111827', padding: '24px', borderRadius: '20px', border: '1px solid #374151', borderTop: `4px solid ${item.col}` }}
          >
            <p style={{ color: '#9ca3af', margin: '0 0 10px 0' }}>{item.label}</p>
            <h2 style={{ fontSize: '28px', margin: 0 }}>{item.val}</h2>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '30px', background: '#111827', padding: '30px', borderRadius: '20px', border: '1px solid #374151' }}>
        <h3 style={{ marginBottom: '20px' }}>AI Tax Intelligence</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;