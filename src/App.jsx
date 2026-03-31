import React, { useState } from "react";
import { LayoutDashboard, FileText, Settings, ShieldAlert, BarChart3, Upload, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Person 1: Defining the sub-pages
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Cards - Added by Person 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Audits", value: "24", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Pending Risk", value: "12%", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
                { label: "Tax Saved", value: "₹4.2L", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all">
                  <div>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Uploader Slot (Awaiting Person 2) */}
            <div className="h-[400px] border-2 border-dashed border-zinc-800/50 rounded-[2.5rem] flex flex-col items-center justify-center bg-zinc-900/5 relative group transition-all duration-700 hover:border-blue-600/30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent)]" />
              <div className="relative text-center">
                <div className="p-5 bg-zinc-900/80 rounded-full mb-6 border border-zinc-800 inline-block shadow-2xl">
                  <Upload size={32} className="text-blue-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Initialize Data Ingestion</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto italic">
                  Person 2: Replace this placeholder with the interactive FileUploader component.
                </p>
              </div>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="p-8 border border-zinc-800 rounded-[2.5rem] bg-zinc-900/20 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6">Recent Audit Reports</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((r) => (
                <div key={r} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-zinc-200">Financial_Statement_Q{r}_2026.pdf</p>
                      <p className="text-xs text-zinc-500 font-mono">Status: Verified | Risk: Low</p>
                    </div>
                  </div>
                  <button className="text-xs font-mono text-blue-500 hover:underline">Download RAW</button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="text-zinc-500 italic">Coming Soon: {activeTab} section...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-10 text-white font-bold text-xl tracking-tighter">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] italic">AA</div>
          Audit Automata
        </div>
        
        <nav className="space-y-1.5 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "reports", label: "Audit Reports", icon: FileText },
            { id: "analytics", label: "Tax Analytics", icon: BarChart3 },
            { id: "compliance", label: "Compliance", icon: ShieldAlert },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? "bg-blue-600/15 text-blue-400 border border-blue-600/20" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
            System_Status: Online_v1.0
          </div>
        </header>

        <div className="max-w-5xl">
          <h1 className="text-5xl font-bold text-white tracking-tight leading-tight mb-8">
            Welcome, <span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Aryan</span>
          </h1>
          
          {/* Dynamic Section Switcher */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;