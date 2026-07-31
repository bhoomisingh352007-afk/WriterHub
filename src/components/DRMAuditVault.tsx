import React, { useState } from "react";
import { DRMAuditLog, Manuscript } from "../types";
import {
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  Lock,
  Cpu,
  FileKey,
  Smartphone,
  EyeOff,
  CopyX,
} from "lucide-react";

interface DRMAuditVaultProps {
  auditLogs: DRMAuditLog[];
  manuscripts: Manuscript[];
}

export const DRMAuditVault: React.FC<DRMAuditVaultProps> = ({ auditLogs, manuscripts }) => {
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [watermarkSearch, setWatermarkSearch] = useState<string>("");
  const [verifiedTokenResult, setVerifiedTokenResult] = useState<any | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction === "ALL") return true;
    return log.action === filterAction;
  });

  const handleVerifyWatermarkCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!watermarkSearch) return;

    // Simulated cryptographic verification
    setVerifiedTokenResult({
      code: watermarkSearch.toUpperCase(),
      valid: true,
      timestamp: "2026-07-29 19:15:30",
      ipAddress: "103.45.12.98",
      publisherName: "Rohan Kapoor (Excel Entertainment)",
      securityLevel: "AES-256-GCM Hardware Encrypted",
      screenRecordingAttempts: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Vault Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>DRM Security & Cryptographic Vault • डिजिटल अधिकार ऑडिट</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Security Audit & Forensic Logs
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Inspect every cryptographic handshake, watermark render, blur incident, and clipboard prevention trigger across all manuscripts.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-xl border border-purple-500/30 text-xs text-purple-300">
            <Cpu className="w-5 h-5 text-purple-400" />
            <div>
              <p className="font-bold text-white">SHA-256 Zero-Knowledge Vault</p>
              <p className="text-[11px] text-slate-400">AES-256-GCM Session Key Rotation</p>
            </div>
          </div>
        </div>

        {/* Top Vault Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Total Audit Events</p>
            <p className="text-2xl font-bold text-white mt-1">{auditLogs.length}</p>
            <p className="text-[10px] text-emerald-400 mt-1">100% Tracked</p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Cryptographic Keys Active</p>
            <p className="text-2xl font-bold text-emerald-300 mt-1">{manuscripts.length}</p>
            <p className="text-[10px] text-slate-400 mt-1">Unique Key per Manuscript</p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Blur Incidents Prevented</p>
            <p className="text-2xl font-bold text-amber-300 mt-1">
              {auditLogs.filter((l) => l.action === "BLUR_TRIGGERED").length}
            </p>
            <p className="text-[10px] text-amber-400/80 mt-1">Focus Loss Obfuscated</p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400">Copy Blocks Enforced</p>
            <p className="text-2xl font-bold text-rose-300 mt-1">
              {auditLogs.filter((l) => l.action === "COPY_BLOCKED").length}
            </p>
            <p className="text-[10px] text-rose-400/80 mt-1">Clipboard Access Denied</p>
          </div>
        </div>
      </div>

      {/* Forensic Watermark Token Verification Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <FileKey className="w-5 h-5 text-purple-400" />
          <span>Forensic Watermark Token Inspector</span>
        </h2>
        <p className="text-xs text-slate-400">
          Enter any watermark token string found on a document or screenshot to trace the exact publisher ID, timestamp, and IP address.
        </p>

        <form onSubmit={handleVerifyWatermarkCode} className="flex gap-2 max-w-xl">
          <input
            type="text"
            value={watermarkSearch}
            onChange={(e) => setWatermarkSearch(e.target.value)}
            placeholder="Enter token code e.g. DRM-EXCEL-889 or Publisher IP..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Trace Token</span>
          </button>
        </form>

        {verifiedTokenResult && (
          <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-xl text-xs space-y-2 text-slate-200 animate-fade-in">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Token Trace Authenticated</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-purple-500/20">
              <div>
                Publisher: <span className="text-white font-semibold">{verifiedTokenResult.publisherName}</span>
              </div>
              <div>
                Timestamp: <span className="text-white font-semibold">{verifiedTokenResult.timestamp}</span>
              </div>
              <div>
                Origin IP: <span className="text-white font-semibold">{verifiedTokenResult.ipAddress}</span>
              </div>
              <div>
                Security: <span className="text-emerald-400 font-semibold">{verifiedTokenResult.securityLevel}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Security Event Log</h2>
            <p className="text-xs text-slate-400">Live feed of reader sessions and DRM protection triggers.</p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Filter Event:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Events</option>
              <option value="KEY_DECRYPT">KEY_DECRYPT</option>
              <option value="WATERMARK_RENDER">WATERMARK_RENDER</option>
              <option value="BLUR_TRIGGERED">BLUR_TRIGGERED</option>
              <option value="COPY_BLOCKED">COPY_BLOCKED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Manuscript</th>
                <th className="p-3">Viewer / Publisher</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Action Triggered</th>
                <th className="p-3">Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3 font-bold text-slate-200 whitespace-nowrap">
                    {log.manuscriptTitle}
                  </td>
                  <td className="p-3 text-slate-300 whitespace-nowrap">
                    {log.viewerName} <span className="text-slate-500">({log.viewerRole})</span>
                  </td>
                  <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {log.viewerIp}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-purple-300 border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.securityStatus === "SECURE"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : log.securityStatus === "FLAGGED_FOCUS_LOSS"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {log.securityStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
