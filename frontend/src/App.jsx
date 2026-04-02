import React, { useState } from "react";
import IngestionHero from "./components/IngestionHero"; 
import AuditResults from "./components/AuditResults";
import { 
  LayoutDashboard, FileText, ShieldAlert, 
  BarChart3, CheckCircle2, AlertTriangle, TrendingUp 
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [auditData, setAuditData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        if (chunk.includes("REPORT:")) {
          try {
            const jsonString = chunk.split("REPORT:")[1].split("\n\n")[0];
            const finalReport = JSON.parse(jsonString);
            setAuditData(finalReport);
          } catch (e) {
            console.error("JSON Parsing Error:", e);
          }
        }
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend se connect nahi ho paya. Check if FastAPI is running!");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* --- DYNAMIC STATS CARDS (CRASH PROOF) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  label: "Total Audits", 
                  value: auditData ? "1" : "0",
                  icon: CheckCircle2, 
                  color: "text-emerald-500", 
                  bg: "bg-emerald-500/10" 
                },
                { 
                  label: "Risk Score", 
                  // Safe check for risk_score
                  value: `${auditData?.risk_score ?? 0}%`, 
                  icon: AlertTriangle, 
                  color: "text-amber-500", 
                  bg: "bg-amber-500/10" 
                },
                { 
                  label: "Tax Saved", 
                  // Safe check for total_saved and toLocaleString
                  value: auditData?.total_saved 
                    ? `₹${auditData.total_saved.toLocaleString()}` 
                    : "₹0", 
                  icon: TrendingUp, 
                  color: "text-blue-500", 
                  bg: "bg-blue-500/10" 
                },
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

            {!auditData ? (
              <div className="flex flex-col items-center">
                <IngestionHero onFileAccepted={handleFileUpload} />
                
                {isProcessing && (
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-400 font-mono text-sm animate-pulse">
                      AI Agents are auditing your statement...
                    </p>
                  </div>
                )}
                
                {!isProcessing && (
                  <button 
                    onClick={() => setAuditData({ total_saved: 45000, risk_score: 15, chart_data: [{name: '80C', value: 40}, {name: '80D', value: 20}] })}
                    className="mt-8 px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-mono rounded-2xl hover:border-blue-500/50 hover:text-blue-400 transition-all shadow-xl flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    FORCE TEST: SIMULATE AUDIT RESULTS
                  </button>
                )}
              </div>
            ) : (
              <AuditResults data={auditData} onReset={() => setAuditData(null)} />
            )}
          </div>
        );

      case "reports":
        return (
          <div className="p-8 border border-zinc-800 rounded-[2.5rem] bg-zinc-900/20 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6">Recent Audit Reports</h2>
            <div className="space-y-4">
              {auditData ? (
                 <div className="flex items-center justify-between p-4 bg-blue-600/5 rounded-2xl border border-blue-500/20 hover:bg-blue-600/10 transition-colors cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                     <FileText size={20} />
                   </div>
                   <div>
                     <p className="font-medium text-sm text-zinc-200">Latest_Audit_Report.pdf</p>
                     <p className="text-xs text-zinc-500 font-mono">
                        Status: Generated | Savings: ₹{auditData?.total_saved?.toLocaleString() ?? "0"}
                     </p>
                   </div>
                 </div>
                 <button className="text-xs font-mono text-blue-500 hover:underline">View Details</button>
               </div>
              ) : (
                <p className="text-zinc-500 italic text-sm">No recent audits found. Start by uploading a statement.</p>
              )}
            </div>
          </div>
        );

      default:
        return <div className="text-zinc-500 italic">Coming Soon: {activeTab} section...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex font-sans selection:bg-blue-500/30">
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

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
            System_Status: Online_v1.0
          </div>
        </header>

        <div className="max-w-5xl">
          <h1 className="text-5xl font-bold text-white tracking-tight leading-tight mb-8">
            Welcome, <span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">User</span>
          </h1>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;