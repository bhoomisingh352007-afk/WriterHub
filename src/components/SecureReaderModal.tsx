import React, { useState, useEffect } from "react";
import { Manuscript, UserRole, Chapter } from "../types";
import {
  X,
  Shield,
  EyeOff,
  Lock,
  Star,
  FileText,
  AlertTriangle,
  Send,
  Clock,
  Sparkles,
  CheckCircle2,
  CopyX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { generateWatermarkLines } from "../utils/cryptoUtils";

interface SecureReaderModalProps {
  manuscript: Manuscript | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  userPublisherName?: string;
  userPublisherCompany?: string;
  hasFullAccess: boolean;
  onRequestAccess: (manuscript: Manuscript) => void;
  onSubmitReview: (
    manuscriptId: string,
    ratings: { plotScore: number; characterScore: number; pacingScore: number; commercialViability: number },
    comment: string
  ) => void;
  onLogSecurityAction: (
    manuscriptId: string,
    action: "KEY_DECRYPT" | "WATERMARK_RENDER" | "BLUR_TRIGGERED" | "COPY_BLOCKED",
    securityStatus: "SECURE" | "FLAGGED_FOCUS_LOSS" | "ATTEMPTED_SELECTION"
  ) => void;
}

export const SecureReaderModal: React.FC<SecureReaderModalProps> = ({
  manuscript,
  isOpen,
  onClose,
  userRole,
  userPublisherName = "Acquisitions Director",
  userPublisherCompany = "National Film & Print House",
  hasFullAccess,
  onRequestAccess,
  onSubmitReview,
  onLogSecurityAction,
}) => {
  if (!isOpen || !manuscript) return null;

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isWindowBlurred, setIsWindowBlurred] = useState<boolean>(false);
  const [copiedAttempted, setCopiedAttempted] = useState<boolean>(false);
  const [readerTheme, setReaderTheme] = useState<"dark" | "sepia" | "light">("dark");
  const [fontSize, setFontSize] = useState<number>(16);
  const [watermarkText] = useState<string>(
    generateWatermarkLines(
      userPublisherName,
      userPublisherCompany,
      manuscript.drmConfig.watermarkText,
      "103.45.12.98"
    )
  );

  // Rating State
  const [showRatingDrawer, setShowRatingDrawer] = useState<boolean>(false);
  const [plotScore, setPlotScore] = useState<number>(5);
  const [characterScore, setCharacterScore] = useState<number>(4);
  const [pacingScore, setPacingScore] = useState<number>(5);
  const [commercialViability, setCommercialViability] = useState<number>(4);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Time-bound preview session counter
  const [timeRemaining, setTimeRemaining] = useState<number>(
    manuscript.drmConfig.expiryHours * 3600
  );

  useEffect(() => {
    // Log initial key decryption & watermark render
    onLogSecurityAction(manuscript.id, "KEY_DECRYPT", "SECURE");
    onLogSecurityAction(manuscript.id, "WATERMARK_RENDER", "SECURE");

    // Focus Loss Screen Blur Listener
    const handleBlur = () => {
      if (manuscript.drmConfig.screenBlurProtection) {
        setIsWindowBlurred(true);
        onLogSecurityAction(manuscript.id, "BLUR_TRIGGERED", "FLAGGED_FOCUS_LOSS");
      }
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // Prevent Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setCopiedAttempted(true);
      setTimeout(() => setCopiedAttempted(false), 3000);
      onLogSecurityAction(manuscript.id, "COPY_BLOCKED", "ATTEMPTED_SELECTION");
    };

    // Prevent Copy Keyboard Shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "p" || e.key === "s")) {
        e.preventDefault();
        setCopiedAttempted(true);
        setTimeout(() => setCopiedAttempted(false), 3000);
        onLogSecurityAction(manuscript.id, "COPY_BLOCKED", "ATTEMPTED_SELECTION");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(timer);
    };
  }, [manuscript]);

  const currentChapter: Chapter | undefined = manuscript.chapters[activeChapterIndex];

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(
      manuscript.id,
      { plotScore, characterScore, pacingScore, commercialViability },
      reviewComment
    );
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowRatingDrawer(false);
      setReviewSubmitted(false);
    }, 2000);
  };

  const isChapterLocked = currentChapter && !currentChapter.isSample && !hasFullAccess;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Screen Protection Alert Overlay when window focus lost */}
      {isWindowBlurred && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 text-white animate-fade-in">
          <div className="p-4 bg-amber-500/20 rounded-full text-amber-400 mb-4 border border-amber-500/30 animate-bounce">
            <EyeOff className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-300 mb-2">
            DRM Screen Protection Active
          </h2>
          <p className="text-slate-300 max-w-md text-sm mb-4">
            Window focus lost. Manuscript content has been automatically obfuscated to prevent recording or screen capturing.
          </p>
          <div className="px-4 py-2 bg-slate-800 rounded-lg text-xs text-slate-400 border border-slate-700">
            Click anywhere on this window to restore secure view
          </div>
        </div>
      )}

      {/* Copy Attempt Notification */}
      {copiedAttempted && (
        <div className="absolute top-6 right-6 z-50 bg-rose-950/90 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs sm:text-sm animate-bounce">
          <CopyX className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div>
            <p className="font-bold">Clipboard Access Denied (DRM Block)</p>
            <p className="text-rose-300/80 text-xs">Text selection and copying are disabled by writer's DRM security settings.</p>
          </div>
        </div>
      )}

      {/* Main Secure Reader Container */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">
        {/* DRM Header Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate flex items-center space-x-2">
                <span>{manuscript.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-normal border border-slate-700">
                  {manuscript.type}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Writer: <span className="text-emerald-400 font-medium">{manuscript.writerName}</span> • DRM Key:{" "}
                <span className="font-mono text-[10px] text-slate-500">{manuscript.drmConfig.encryptionKeyHash.slice(0, 14)}...</span>
              </p>
            </div>
          </div>

          {/* Reader Controls & Expiry */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Timer Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-xs text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Pass Expires:</span>
              <span className="font-mono font-bold text-amber-200">{formatTimer(timeRemaining)}</span>
            </div>

            {/* Theme Selectors */}
            <div className="hidden md:flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 space-x-1 text-xs">
              <button
                onClick={() => setReaderTheme("dark")}
                className={`px-2 py-0.5 rounded ${readerTheme === "dark" ? "bg-slate-700 text-white font-bold" : "text-slate-400"}`}
              >
                Dark
              </button>
              <button
                onClick={() => setReaderTheme("sepia")}
                className={`px-2 py-0.5 rounded ${readerTheme === "sepia" ? "bg-amber-100 text-amber-950 font-bold" : "text-slate-400"}`}
              >
                Sepia
              </button>
              <button
                onClick={() => setReaderTheme("light")}
                className={`px-2 py-0.5 rounded ${readerTheme === "light" ? "bg-white text-slate-900 font-bold" : "text-slate-400"}`}
              >
                Light
              </button>
            </div>

            {/* Font Size Adjust */}
            <div className="hidden md:flex items-center space-x-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <button onClick={() => setFontSize((f) => Math.max(12, f - 2))} className="hover:text-white px-1">
                A-
              </button>
              <span className="font-mono text-[10px]">{fontSize}px</span>
              <button onClick={() => setFontSize((f) => Math.min(24, f + 2))} className="hover:text-white px-1">
                A+
              </button>
            </div>

            {/* Publisher Rating Trigger */}
            <button
              id="btn-rate-script-inside-reader"
              onClick={() => setShowRatingDrawer(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Rate Script</span>
            </button>

            <button
              id="btn-close-secure-reader"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Chapter Sidebar */}
          <div className="w-64 bg-slate-950/60 border-r border-slate-800 p-3 hidden sm:flex flex-col space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Chapters ({manuscript.chapters.length})
            </div>
            {manuscript.chapters.map((ch, idx) => {
              const locked = !ch.isSample && !hasFullAccess;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between ${
                    activeChapterIndex === idx
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold"
                      : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate">{ch.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{ch.wordCount.toLocaleString()} words</p>
                  </div>
                  {locked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}

            {/* Access Status Card */}
            <div className="mt-auto p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Access Level</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {hasFullAccess ? "Full Manuscript Access Granted" : "Sample Chapters Preview (DRM Lock Active)"}
              </p>
              {!hasFullAccess && (
                <button
                  onClick={() => onRequestAccess(manuscript)}
                  className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-[11px] transition-colors"
                >
                  Request Full Pass
                </button>
              )}
            </div>
          </div>

          {/* Secure Reader Canvas with Dynamic Watermark */}
          <div
            className={`flex-1 overflow-y-auto p-6 sm:p-10 relative select-none ${
              readerTheme === "dark"
                ? "bg-slate-950 text-slate-200"
                : readerTheme === "sepia"
                ? "bg-[#fdf6e3] text-[#433422]"
                : "bg-white text-slate-900"
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {/* Dynamic Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 opacity-15 overflow-hidden select-none z-10">
              <div className="space-y-16 rotate-[-15deg] transform scale-110 font-mono text-xs sm:text-sm font-extrabold uppercase tracking-widest text-current">
                <p>{watermarkText}</p>
                <p>{watermarkText}</p>
                <p>{watermarkText}</p>
                <p>{watermarkText}</p>
                <p>{watermarkText}</p>
                <p>{watermarkText}</p>
              </div>
            </div>

            {/* Document Content View */}
            {isChapterLocked ? (
              <div className="max-w-xl mx-auto my-12 p-8 bg-slate-900/90 border border-amber-500/30 rounded-2xl text-center space-y-4 text-slate-100 shadow-2xl relative z-20">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-amber-300">
                  Chapter Locked under Writer DRM Protocol
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Chapter "{currentChapter?.title}" is protected by writer <span className="text-emerald-400 font-semibold">{manuscript.writerName}</span>.
                  Sample preview ends at Chapter {manuscript.drmConfig.samplePageLimit}.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => onRequestAccess(manuscript)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                  >
                    Send Access Request / NDA
                  </button>
                  <button
                    onClick={() => setActiveChapterIndex(0)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                  >
                    Back to Sample Chapter 1
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6 relative z-20 leading-relaxed font-serif">
                <div className="border-b border-current/20 pb-4 mb-6 font-sans">
                  <div className="flex items-center justify-between text-xs opacity-70">
                    <span>{manuscript.type}</span>
                    <span>{currentChapter?.wordCount} Words</span>
                  </div>
                  <h1 className="text-2xl font-bold mt-1 text-current">{currentChapter?.title}</h1>
                </div>

                {/* Main Manuscript Text */}
                <div className="whitespace-pre-line tracking-wide space-y-4">
                  {currentChapter?.content}
                </div>

                <div className="pt-12 border-t border-current/20 text-center font-sans text-xs opacity-60">
                  — End of {currentChapter?.title} — Protected under ScriptShield DRM License —
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Publisher Rating Drawer */}
        {showRatingDrawer && (
          <div className="absolute inset-y-0 right-0 z-40 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col space-y-5 animate-slide-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">Rate Manuscript</h3>
              </div>
              <button
                onClick={() => setShowRatingDrawer(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-emerald-300 text-base">Rating & Review Submitted!</h4>
                <p className="text-xs text-slate-300">
                  Your feedback has been encrypted and shared with the writer.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
                <p className="text-xs text-slate-400">
                  Rate <span className="text-emerald-400 font-semibold">{manuscript.title}</span> on key evaluation pillars:
                </p>

                {/* Score Sliders */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Story & Plot Strength</span>
                      <span className="font-bold text-amber-400">{plotScore} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={plotScore}
                      onChange={(e) => setPlotScore(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Character Arc & Depth</span>
                      <span className="font-bold text-amber-400">{characterScore} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={characterScore}
                      onChange={(e) => setCharacterScore(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Pacing & Dialogue</span>
                      <span className="font-bold text-amber-400">{pacingScore} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={pacingScore}
                      onChange={(e) => setPacingScore(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Commercial Viability (OTT/Print)</span>
                      <span className="font-bold text-amber-400">{commercialViability} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={commercialViability}
                      onChange={(e) => setCommercialViability(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Publisher Review Notes (for Writer)
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Provide constructive feedback, market appeal, or next steps..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Rating & Review</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
