"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { TradingProfileInput } from "@/types/trading";
import { TradingForm } from "@/components/TradingForm";
import { TradingCoachChat } from "@/components/TradingCoachChat";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

export default function Home() {
  const [plan, setPlan] = useState<{ markdown: string } | null>(null);
  const [profile, setProfile] = useState<TradingProfileInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"plan" | "coach">("plan");

  const handleSubmit = async (formData: TradingProfileInput) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setProfile(formData);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Une erreur est survenue lors de la génération du plan.");
      }

      const data = await res.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (plan?.markdown) {
      try {
        await navigator.clipboard.writeText(plan.markdown);
        alert("Plan copié dans le presse-papiers !");
      } catch (err) {
        console.error("Erreur lors de la copie :", err);
      }
    }
  };

  const handleDownloadPdf = async () => {
    if (!plan || !profile) return;

    try {
      const res = await fetch("/api/plan-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: plan.markdown, profile }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la génération du PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "plan-trading.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du téléchargement du PDF");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-6xl px-4 space-y-10 relative z-10">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-block p-2 px-4 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-4">
            <span className="text-xs font-medium text-blue-400 tracking-wider uppercase">Intelligence Artificielle de Trading</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              AlgoNovaAI
            </span>
            <br />
            <span className="text-white">TradePlan Builder</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transformez votre approche du marché. Remplissez votre profil et laissez notre IA concevoir un plan de trading sur-mesure, rigoureux et professionnel.
          </p>
        </header>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Left Column: Form */}
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-800/60 p-1 shadow-2xl ring-1 ring-white/5">
            <div className="bg-slate-950/50 rounded-[20px] p-6 md:p-8 h-full">
              <TradingForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-800/60 p-1 shadow-2xl ring-1 ring-white/5 h-full min-h-[600px] flex flex-col">
            <div className="bg-slate-950/50 rounded-[20px] p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 animate-pulse">
                Génération du plan en cours...
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center text-red-400 text-center px-4">
                {error}
              </div>
            ) : plan ? (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
                  <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
                    <button 
                        onClick={() => setActiveTab("plan")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "plan" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                        Ton Plan
                    </button>
                    <button 
                        onClick={() => setActiveTab("coach")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "coach" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                        Coach IA
                    </button>
                  </div>
                  
                  {activeTab === "plan" && (
                    <div className="flex gap-2">
                        <button
                        onClick={handleCopy}
                        className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
                        >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        Copier
                        </button>
                        <button
                        onClick={handleDownloadPdf}
                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        PDF
                        </button>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                    {activeTab === "plan" ? (
                        <div className="prose prose-invert max-w-none text-sm overflow-y-auto h-full pr-2 custom-scrollbar absolute inset-0">
                            <ReactMarkdown>{plan.markdown}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-full absolute inset-0">
                            <TradingCoachChat plan={plan.markdown} profile={profile} />
                        </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center space-y-4">
                <svg
                  className="w-16 h-16 opacity-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>
                  Ton plan de trading généré par l'IA apparaîtra ici.
                  <br />
                  <span className="text-xs opacity-70">
                    (Règles d'entrée, gestion du risque, psychologie...)
                  </span>
                </p>
              </div>
            )}
            </div>
          </div>
        </div>
        {/* Disclaimer Footer */}
        <footer className="text-center pt-10 pb-4 border-t border-slate-800/50 mt-10">
          <p className="text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-slate-400">Avertissement sur les risques :</strong> Le trading sur les marchés financiers implique un niveau de risque élevé et peut ne pas convenir à tous les investisseurs. Vous pouvez perdre tout ou partie de votre capital investi.
            <br className="mb-2" />
            <span className="block mt-2">
              <strong>AlgoNovaAI TradePlan Builder</strong> est un outil d'aide à la décision et de structuration de plan de trading. Il ne constitue en aucun cas un conseil en investissement, une recommandation d'achat ou de vente, ou une sollicitation à trader. Les performances passées ne préjugent pas des performances futures. Utilisez cet outil à titre éducatif et informatif uniquement.
            </span>
          </p>
        </footer>
      </div>
    </main>
  );
}
