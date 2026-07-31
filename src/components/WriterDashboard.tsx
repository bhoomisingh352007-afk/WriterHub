import React, { useState } from "react";
import { Manuscript, AccessRequest, PublisherOffer, DRMAuditLog } from "../types";
import {
  Shield,
  Lock,
  Eye,
  Star,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  Plus,
  FileCheck,
  ChevronRight,
  Sparkles,
  TrendingUp,
  BarChart2,
  DollarSign,
  Briefcase,
  Layers,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../utils/cryptoUtils";

interface WriterDashboardProps {
  manuscripts: Manuscript[];
  accessRequests: AccessRequest[];
  offers: PublisherOffer[];
  auditLogs: DRMAuditLog[];
  onOpenUploadModal: () => void;
  onOpenReader: (manuscript: Manuscript) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onAcceptOffer: (offerId: string) => void;
  onOpenAIAssistant: () => void;
}

export const WriterDashboard: React.FC<WriterDashboardProps> = ({
  manuscripts,
  accessRequests,
  offers,
  auditLogs,
  onOpenUploadModal,
  onOpenReader,
  onApproveRequest,
  onRejectRequest,
  onAcceptOffer,
  onOpenAIAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<"scripts" | "requests" | "offers" | "analytics">("scripts");

  // Summary Metrics
  const totalViews = manuscripts.reduce((acc, curr) => acc + curr.totalViews, 0);
  const totalReaders = manuscripts.reduce((acc, curr) => acc + curr.uniqueReaders, 0);
  const pendingRequests = accessRequests.filter((r) => r.status === "pending");
  const pendingOffers = offers.filter((o) => o.status === "pending");

  // Mock views data for charts
  const analyticsTimeData = [
    { date: "Jul 23", views: 42, previewMinutes: 120 },
    { date: "Jul 24", views: 68, previewMinutes: 210 },
    { date: "Jul 25", views: 95, previewMinutes: 340 },
    { date: "Jul 26", views: 110, previewMinutes: 420 },
    { date: "Jul 27", views: 145, previewMinutes: 580 },
    { date: "Jul 28", views: 190, previewMinutes: 720 },
    { date: "Jul 29", views: 240, previewMinutes: 890 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & DRM Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shield className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Writer Secure Vault • लेखक डैशबोर्ड</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Bhoomi (भूमि सिंह)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Your content is encrypted with AES-256 DRM. Publishers can only view watermarked previews with your explicit permission.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAIAssistant}
              className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Script Doctor</span>
            </button>
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Script</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Protected Scripts</p>
            <p className="text-2xl font-bold text-white mt-1">{manuscripts.length}</p>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>100% Encrypted</span>
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Publisher Views</p>
            <p className="text-2xl font-bold text-white mt-1">{totalViews}</p>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+24% this week</span>
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Pending Requests</p>
            <p className="text-2xl font-bold text-amber-300 mt-1">{pendingRequests.length}</p>
            <p className="text-[10px] text-amber-400/80 mt-1">Requires Your Approval</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Licensing Offers</p>
            <p className="text-2xl font-bold text-purple-300 mt-1">{offers.length}</p>
            <p className="text-[10px] text-purple-400/80 mt-1">Active Bids</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab("scripts")}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === "scripts"
              ? "border-emerald-500 text-emerald-400 font-bold"
              : "border-transparent hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Encrypted Scripts ({manuscripts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all relative ${
            activeTab === "requests"
              ? "border-emerald-500 text-emerald-400 font-bold"
              : "border-transparent hover:text-slate-200"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Access Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("offers")}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === "offers"
              ? "border-emerald-500 text-emerald-400 font-bold"
              : "border-transparent hover:text-slate-200"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Acquisition Offers ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === "analytics"
              ? "border-emerald-500 text-emerald-400 font-bold"
              : "border-transparent hover:text-slate-200"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Real-time Analytics</span>
        </button>
      </div>

      {/* Tab Content 1: My Scripts List */}
      {activeTab === "scripts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {manuscripts.map((ms) => {
            const avgRating =
              ms.reviews.length > 0
                ? (
                    ms.reviews.reduce((acc, curr) => acc + curr.rating.overallRating, 0) /
                    ms.reviews.length
                  ).toFixed(1)
                : "New";

            return (
              <div
                key={ms.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg font-semibold flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>{ms.status.replace("_", " ")}</span>
                    </span>

                    <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{avgRating} ({ms.reviews.length})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {ms.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ms.synopsis}</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-300">
                    <span className="px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700">
                      Genre: {ms.genre}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700">
                      Lang: {ms.language}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700">
                      {ms.wordCount.toLocaleString()} Words
                    </span>
                  </div>
                </div>

                {/* DRM Security Panel */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center space-x-1 text-slate-300">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Watermark Label:</span>
                    </span>
                    <span className="font-mono text-slate-400 truncate max-w-[180px]">
                      {ms.drmConfig.watermarkText}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                    <div className="text-slate-400">
                      Sample Chapter Limit:{" "}
                      <span className="text-slate-200 font-bold">{ms.drmConfig.samplePageLimit} Chapters</span>
                    </div>
                    <div className="text-slate-400">
                      Screen Blur Protection:{" "}
                      <span className="text-emerald-400 font-bold">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="text-slate-400 text-[11px] flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ms.totalViews} Views</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ms.uniqueReaders} Readers</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenReader(ms)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium flex items-center space-x-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Preview Secure Reader</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content 2: Access Requests */}
      {activeTab === "requests" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Publisher Access Requests</h2>
              <p className="text-xs text-slate-400">
                Publishers must request permission to read beyond sample chapters.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
              {pendingRequests.length} Pending Approvals
            </span>
          </div>

          <div className="space-y-3">
            {accessRequests.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">No access requests at this time.</p>
            ) : (
              accessRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{req.publisherName}</span>
                      <span className="text-xs text-slate-400">({req.publisherCompany})</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase ${
                          req.status === "approved"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : req.status === "rejected"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Requested Access for: <span className="text-emerald-300 font-medium">{req.manuscriptTitle}</span>
                    </p>
                    <p className="text-xs text-slate-400 italic">"{req.requestReason}"</p>
                    <p className="text-[10px] text-slate-500">Requested on: {req.requestedAt}</p>
                  </div>

                  {req.status === "pending" ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onApproveRequest(req.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-md"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Grant 48h DRM Pass</span>
                      </button>
                      <button
                        onClick={() => onRejectRequest(req.id)}
                        className="px-3 py-2 bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-200 border border-slate-700 rounded-xl text-xs flex items-center space-x-1 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : req.status === "approved" ? (
                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-400 font-bold block">
                        Pass Code: {req.accessCode}
                      </span>
                      <span className="text-[10px] text-slate-500">Expires: {req.expiresAt}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-rose-400 italic">Access Declined</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: Offers */}
      {activeTab === "offers" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Acquisition & Option Offers</h2>
            <p className="text-xs text-slate-400">
              Publishers and production houses can place formal licensing bids for film, TV, or publishing rights.
            </p>
          </div>

          <div className="space-y-4">
            {offers.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">No active licensing offers.</p>
            ) : (
              offers.map((off) => (
                <div
                  key={off.id}
                  className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded-md border border-purple-500/30">
                        {off.offerType.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-white">{off.publisherName}</span>
                      <span className="text-xs text-slate-400">({off.publisherCompany})</span>
                    </div>

                    <h3 className="text-base font-bold text-emerald-400">{off.manuscriptTitle}</h3>
                    <p className="text-xs text-slate-300 max-w-2xl">{off.termsSummary}</p>

                    <div className="text-xs text-slate-400 pt-1">
                      Submitted: <span className="text-slate-300">{off.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center space-y-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Offer Amount</span>
                      <span className="text-2xl font-extrabold text-amber-300">
                        {formatCurrency(off.amount, off.currency)}
                      </span>
                    </div>

                    {off.status === "pending" ? (
                      <button
                        onClick={() => onAcceptOffer(off.id)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-lg"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept & Generate Contract</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold">
                        Accepted Offer
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content 4: Real-time Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-1">Publisher Read Engagement (Views over Time)</h2>
            <p className="text-xs text-slate-400 mb-6">Real-time view telemetry and reader session duration.</p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsTimeData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
