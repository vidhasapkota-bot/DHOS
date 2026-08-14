import React, { useState } from 'react';
import { Sparkles, Bot, Send, X, Loader2, Lightbulb, AlertCircle } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalDataSummary: any;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  hospitalDataSummary
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQueryAI = async (queryText?: string) => {
    const finalQuery = queryText || prompt;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/dhos/ai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: finalQuery,
          context: hospitalDataSummary
        })
      });

      const data = await res.json();
      if (data.analysis) {
        setAiResponse(data.analysis);
      } else {
        setAiResponse('Operational intelligence response received.');
      }
    } catch (err) {
      console.error(err);
      setAiResponse('Unable to reach AI Operational Intelligence service. Please check server connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    'Analyze ED Triage Bottlenecks & Recommend Bed Discharges (WF-002)',
    'Audit ICU Step-Down Eligibility & Mechanical Vent Weaning (WF-135)',
    'Check High-Risk eMAR Medication Dual Sign-off Compliance (WF-174)'
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Operational Assistant (Server-Side Gemini Engine)
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Actions */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Suggested Operational Intelligence Queries:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetQueries.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(pq);
                  handleQueryAI(pq);
                }}
                className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-800/80 rounded-lg text-xs font-medium text-left transition"
              >
                {pq}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI about hospital capacity, triage flow, or safety compliance..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQueryAI()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleQueryAI()}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Analyze
          </button>
        </div>

        {/* Response Box */}
        {loading && (
          <div className="p-8 text-center text-xs text-purple-300 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            Evaluating clinical workflow telemetry across 14 DHOS modules...
          </div>
        )}

        {aiResponse && !loading && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 max-h-72 overflow-y-auto text-xs text-slate-200 leading-relaxed font-sans">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold border-b border-slate-800/80 pb-2">
              <Bot className="w-4 h-4 text-purple-400" />
              AI Operational Evaluation & Recommendation:
            </div>
            <div className="whitespace-pre-wrap">{aiResponse}</div>
          </div>
        )}
      </div>
    </div>
  );
};
