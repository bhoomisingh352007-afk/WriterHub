import React, { useState } from "react";
import { Manuscript, DRMConfig } from "../types";
import { X, Lock, Shield, Sparkles, CheckCircle2, Upload, FileText, Key } from "lucide-react";
import { generateSHA256Hash, simulateEncryptContent } from "../utils/cryptoUtils";

interface UploadScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManuscript: (newScript: Manuscript) => void;
}

export const UploadScriptModal: React.FC<UploadScriptModalProps> = ({
  isOpen,
  onClose,
  onAddManuscript,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [logline, setLogline] = useState<string>("");
  const [genre, setGenre] = useState<
    "Crime Thriller" | "Sci-Fi / Fantasy" | "Bollywood Feature Script" | "Romantic Poetry" | "Startup Drama" | "Historical Drama" | "Horror"
  >("Crime Thriller");
  const [type, setType] = useState<
    "Screenplay" | "Novel / Manuscript" | "Poetry Collection" | "TV Series Bible" | "Short Story"
  >("Screenplay");
  const [language, setLanguage] = useState<"Hindi" | "English" | "Hinglish">("Hindi");
  const [chapter1Title, setChapter1Title] = useState<string>("Chapter 1: The Beginning");
  const [content, setContent] = useState<string>("");

  // DRM Settings
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL PROPERTY OF WRITER - DO NOT COPY");
  const [samplePageLimit, setSamplePageLimit] = useState<number>(2);
  const [expiryHours, setExpiryHours] = useState<number>(48);
  const [screenBlurProtection, setScreenBlurProtection] = useState<boolean>(true);

  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const scriptId = `ms-${Date.now()}`;
    const encryptionKey = generateSHA256Hash(`${scriptId}-${title}`);

    const newManuscript: Manuscript = {
      id: scriptId,
      title,
      synopsis,
      logline: logline || synopsis.slice(0, 100),
      genre,
      type,
      language,
      wordCount: content.split(/\s+/).length,
      writerId: "writer-01",
      writerName: "Bhoomi Singh (भूमि सिंह)",
      writerEmail: "bhoomi.writer@writerhub.io",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      status: "DRM_Protected",
      encryptedPayload: simulateEncryptContent(content, encryptionKey),
      drmConfig: {
        watermarkText: watermarkText || `PROPERTY OF BHOOMI SINGH (WRITERHUB)`,
        allowCopy: false,
        allowDownload: false,
        screenBlurProtection,
        samplePageLimit,
        expiryHours,
        encryptionKeyHash: encryptionKey,
        ipTrackingEnabled: true,
        ndaRequired: true,
      },
      chapters: [
        {
          id: `ch-${scriptId}-1`,
          number: 1,
          title: chapter1Title,
          wordCount: content.split(/\s+/).length,
          content,
          isSample: true,
        },
      ],
      totalViews: 0,
      uniqueReaders: 0,
      averageReadPercentage: 0,
      reviews: [],
      accessRequests: [],
      offers: [],
    };

    setIsEncrypted(true);
    setTimeout(() => {
      onAddManuscript(newManuscript);
      setIsEncrypted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Shield className="w-5 h-5" />
            <h2 className="font-bold text-white text-base">Encrypt & Add New Script / Manuscript</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isEncrypted ? (
          <div className="p-10 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-4">
            <Lock className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="font-bold text-emerald-300 text-lg">Encrypting with AES-256 DRM...</h3>
            <p className="text-xs text-slate-300">
              Generating zero-knowledge cryptographic hash key and watermarking protocol...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Script / Book Title (शीर्षक) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kashipur Confidential (काशीपुर कॉन्फिडेंशियल)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Genre (विधा)</label>
                <select
                  value={genre}
                  onChange={(e: any) => setGenre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Crime Thriller">Crime Thriller</option>
                  <option value="Sci-Fi / Fantasy">Sci-Fi / Fantasy</option>
                  <option value="Bollywood Feature Script">Bollywood Feature Script</option>
                  <option value="Romantic Poetry">Romantic Poetry</option>
                  <option value="Startup Drama">Startup Drama</option>
                  <option value="Historical Drama">Historical Drama</option>
                  <option value="Horror">Horror</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Format Type</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Screenplay">Screenplay (पटकथा)</option>
                  <option value="Novel / Manuscript">Novel / Manuscript (उपन्यास)</option>
                  <option value="Poetry Collection">Poetry Collection (कविता संग्रह)</option>
                  <option value="TV Series Bible">TV Series Bible</option>
                  <option value="Short Story">Short Story</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e: any) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="English">English</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Logline (Commercial Hook)</label>
              <input
                type="text"
                value={logline}
                onChange={(e) => setLogline(e.target.value)}
                placeholder="1-sentence pitch for producers and publishers..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Synopsis (सारांश)</label>
              <textarea
                rows={2}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Brief plot outline..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Manuscript Content Input */}
            <div className="border-t border-slate-800 pt-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Chapter 1 Title & Content (स्क्रिप्ट / चैप्टर का टेक्स्ट) *
              </label>
              <input
                type="text"
                value={chapter1Title}
                onChange={(e) => setChapter1Title(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 mb-2 focus:outline-none focus:border-emerald-500"
              />
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste or type script scene / text here in Hindi or English..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-serif leading-relaxed"
                required
              />
            </div>

            {/* DRM Customization Panel */}
            <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Lock className="w-4 h-4" />
                <span>DRM Security Settings (डिजिटल अधिकार कॉन्फ़िगरेशन)</span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Custom Watermark Overlay Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 mb-1">Sample Chapter Limit</label>
                  <select
                    value={samplePageLimit}
                    onChange={(e) => setSamplePageLimit(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value={1}>1 Chapter Free Preview</option>
                    <option value={2}>2 Chapters Free Preview</option>
                    <option value={3}>3 Chapters Free Preview</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Pass Expiration Window</label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value={24}>24 Hours Pass</option>
                    <option value={48}>48 Hours Pass</option>
                    <option value={72}>72 Hours Pass</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-300">Screen Blur on Focus Loss (Alt-Tab Protection)</span>
                <input
                  type="checkbox"
                  checked={screenBlurProtection}
                  onChange={(e) => setScreenBlurProtection(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg"
            >
              <Lock className="w-4 h-4" />
              <span>Encrypt with AES-256 & Publish to Vault</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
