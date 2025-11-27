"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  plan: string;
  profile: any;
}

export function TradingCoachChat({ plan, profile }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour ! Je suis ton coach trading IA. Je connais ton plan par cœur. Comment puis-je t'aider à le respecter aujourd'hui ?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const newMessages = [...messages, { role: "user", content } as Message];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, plan, profile }),
      });
      
      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-[400px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
              m.role === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/50"
            }`}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-slate-800/50 px-4 py-2 rounded-full text-slate-400 text-xs animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 bg-slate-900/30 border-t border-slate-700/30">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-1 custom-scrollbar">
            {["Explique-moi cette règle", "Optimise mon plan", "Ma routine journalière", "Alertes disciplinaires"].map(q => (
                <button key={q} onClick={() => sendMessage(q)} className="whitespace-nowrap px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 text-xs rounded-full text-blue-300 transition-colors border border-slate-700/50 hover:border-blue-500/30">
                    {q}
                </button>
            ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2 relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose une question à ton coach..."
            className="flex-1 bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-slate-600 transition-all"
          />
          <button type="submit" disabled={loading} className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-600/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
