import React, { useState } from "react";
import { Manuscript, UserRole } from "../types";
import { X, Sparkles, Shield, Send, CheckCircle2, AlertTriangle, TrendingUp, Cpu } from "lucide-react";

interface AIScriptAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  manuscripts: Manuscript[];
  currentRole: UserRole;
}

export const AIScriptAssistant: React.FC<AIScriptAssistantProps> = ({
  isOpen,
  onClose,
  manuscripts,
  currentRole,
}) => {
  if (!isOpen) return null;

  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string>(
    manuscripts[0]?.id || ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const selectedManuscript = manuscripts.find((m) => m.id === selectedManuscriptId);

  const handleRunAIAnalysis = async () => {
    if (!selectedManuscript) return;
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/analyze-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedManuscript.title,
          synopsis: selectedManuscript.synopsis,
          genre: selectedManuscript.genre,
          sampleExcerpt: selectedManuscript.chapters[0]?.content || selectedManuscript.synopsis,
          mode: currentRole === "publisher" ? "publisher-eval" : "writer-eval",
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-purple-400">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <h2 className="font-bold text-white text-base">
              AI Script Doctor & DRM Evaluator (Gemini Powered)
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Script to Evaluate
            </label>
            <select
              value={selectedManuscriptId}
              onChange={(e) => {
                setSelectedManuscriptId(e.target.value);
                setAnalysisResult(null);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              {manuscripts.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.genre} - {m.writerName})
                </option>
              ))}
            </select>
          </div>

          {!analysisResult && !loading && (
            <div className="p-8 bg-slate-950/60 border border-slate-800 rounded-2xl text-center space-y-3">
              <Cpu className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="font-bold text-slate-200 text-sm">Instant Gemini AI Script Analysis</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Evaluate commercial viability score, pitch loglines, target audience demographics, and DRM leak protection advice.
              </p>
              <button
                onClick={handleRunAIAnalysis}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 mx-auto transition-all shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Analysis Now</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="p-10 bg-purple-950/20 border border-purple-500/30 rounded-2xl text-center space-y-3">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-spin" />
              <h3 className="font-bold text-purple-300 text-sm">Analyzing Script Structure & DRM...</h3>
              <p className="text-xs text-slate-400">Reading plot points and evaluating market viability...</p>
            </div>
          )}

          {analysisResult && (
            <div className="bg-slate-950 border border-purple-500/30 p-5 rounded-2xl space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{selectedManuscript?.title}</span>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold text-xs flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Commercial Score: {analysisResult.commercialScore} / 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-slate-400">
                  <strong className="text-purple-300">Logline:</strong> "{analysisResult.logline}"
                </p>
                <p className="text-slate-400">
                  <strong className="text-purple-300">Target Platforms & Audience:</strong>{" "}
                  {analysisResult.targetAudience}
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-200 mb-1">Key Strengths:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                  {analysisResult.strengths?.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start space-x-2">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-200">DRM Security Recommendation:</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{analysisResult.suggestedImprovement}</p>
                </div>
              </div>

              <button
                onClick={handleRunAIAnalysis}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Re-analyze Script
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
