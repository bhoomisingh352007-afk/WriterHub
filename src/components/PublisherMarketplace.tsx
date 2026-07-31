import React, { useState } from "react";
import { Manuscript, AccessRequest } from "../types";
import {
  Search,
  Filter,
  Shield,
  Lock,
  Eye,
  Star,
  Key,
  DollarSign,
  Bookmark,
  Building2,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  Briefcase,
  ChevronRight,
  Send,
  X,
} from "lucide-react";
import { formatCurrency } from "../utils/cryptoUtils";

interface PublisherMarketplaceProps {
  manuscripts: Manuscript[];
  myAccessRequests: AccessRequest[];
  onOpenReader: (manuscript: Manuscript) => void;
  onRequestAccess: (manuscript: Manuscript) => void;
  onSubmitOffer: (
    manuscriptId: string,
    offerType: "option_rights" | "outright_buyout" | "royalty_publishing" | "adaptation_screenplay",
    amount: number,
    terms: string
  ) => void;
}

export const PublisherMarketplace: React.FC<PublisherMarketplaceProps> = ({
  manuscripts,
  myAccessRequests,
  onOpenReader,
  onRequestAccess,
  onSubmitOffer,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Offer Modal State
  const [offerModalScript, setOfferModalScript] = useState<Manuscript | null>(null);
  const [offerType, setOfferType] = useState<
    "option_rights" | "outright_buyout" | "royalty_publishing" | "adaptation_screenplay"
  >("option_rights");
  const [offerAmount, setOfferAmount] = useState<number>(1500000); // 15 Lakhs default
  const [termsSummary, setTermsSummary] = useState<string>("");
  const [offerSubmitted, setOfferSubmitted] = useState<boolean>(false);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredManuscripts = manuscripts.filter((ms) => {
    const matchesSearch =
      ms.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ms.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ms.writerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = selectedGenre === "All" || ms.genre === selectedGenre;
    const matchesType = selectedType === "All" || ms.type === selectedType;
    const matchesLang = selectedLanguage === "All" || ms.language === selectedLanguage;

    return matchesSearch && matchesGenre && matchesType && matchesLang;
  });

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerModalScript) return;

    onSubmitOffer(offerModalScript.id, offerType, offerAmount, termsSummary);
    setOfferSubmitted(true);
    setTimeout(() => {
      setOfferModalScript(null);
      setOfferSubmitted(false);
      setTermsSummary("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Publisher Header & Search Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/70 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Publisher Discovery Hub • प्रकाशक बाज़ार</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Discover Encrypted Manuscripts & Scripts
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Browse original scripts with digital rights management. Read sample chapters with dynamic watermarking, rate manuscripts, or request full access passes.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Dynamic DRM Protection Active</p>
              <p className="text-[11px] text-slate-400">All reads watermarked with your company ID</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, genre, writer..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Genres (सभी विधाएं)</option>
            <option value="Crime Thriller">Crime Thriller</option>
            <option value="Sci-Fi / Fantasy">Sci-Fi / Fantasy</option>
            <option value="Romantic Poetry">Romantic Poetry</option>
            <option value="Startup Drama">Startup Drama</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Format Types</option>
            <option value="Bollywood Feature Script">Bollywood Feature Script</option>
            <option value="Novel / Manuscript">Novel / Manuscript</option>
            <option value="Poetry Collection">Poetry Collection</option>
            <option value="TV Series Bible">TV Series Bible</option>
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Languages (हिंदी / Eng / Hinglish)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="English">English</option>
            <option value="Hinglish">Hinglish</option>
          </select>
        </div>
      </div>

      {/* Manuscript Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredManuscripts.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <p className="text-sm font-semibold">No scripts match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedGenre("All");
                setSelectedType("All");
                setSelectedLanguage("All");
              }}
              className="mt-3 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredManuscripts.map((ms) => {
            const isBookmarked = bookmarkedIds.includes(ms.id);
            const myRequest = myAccessRequests.find((r) => r.manuscriptId === ms.id);
            const hasApprovedPass = myRequest?.status === "approved";

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
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between space-y-4 shadow-md group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg font-semibold">
                        {ms.genre}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                        {ms.language}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(ms.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                      }`}
                      title="Bookmark Script"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
                    </button>
                  </div>

                  <h3 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                    {ms.title}
                  </h3>
                  <p className="text-xs font-medium text-emerald-400 mt-1">
                    Writer: {ms.writerName}
                  </p>

                  <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-200">Logline:</p>
                    <p className="text-slate-400 italic">"{ms.logline}"</p>
                  </div>

                  {/* Rating Summary */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{avgRating}</span>
                      <span className="text-slate-500 text-[11px]">({ms.reviews.length} Editor Reviews)</span>
                    </div>
                    <span>{ms.wordCount.toLocaleString()} Words</span>
                  </div>
                </div>

                {/* DRM Access & Action Buttons */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>Sample Preview: {ms.drmConfig.samplePageLimit} Chapters</span>
                    </span>
                    {hasApprovedPass ? (
                      <span className="text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>48h Pass Active</span>
                      </span>
                    ) : myRequest?.status === "pending" ? (
                      <span className="text-amber-300 font-bold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pass Pending Approval</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenReader(ms)}
                      className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Read Watermarked Preview</span>
                    </button>

                    {hasApprovedPass ? (
                      <button
                        onClick={() => setOfferModalScript(ms)}
                        className="py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>Submit Acquisition Offer</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onRequestAccess(ms)}
                        disabled={myRequest?.status === "pending"}
                        className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                          myRequest?.status === "pending"
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                        }`}
                      >
                        <Key className="w-4 h-4 text-emerald-400" />
                        <span>
                          {myRequest?.status === "pending" ? "Pass Requested" : "Request Full Pass / NDA"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Acquisition Offer Modal */}
      {offerModalScript && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-purple-400">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Submit Acquisition Offer</h3>
              </div>
              <button
                onClick={() => setOfferModalScript(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {offerSubmitted ? (
              <div className="p-8 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-emerald-300 text-lg">Offer Encrypted & Sent!</h4>
                <p className="text-xs text-slate-300">
                  Writer <span className="text-white font-semibold">{offerModalScript.writerName}</span> has received your bid of {formatCurrency(offerAmount, "INR")}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Script Title: <span className="text-white font-bold">{offerModalScript.title}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Writer: <span className="text-emerald-400 font-semibold">{offerModalScript.writerName}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Offer Category</label>
                  <select
                    value={offerType}
                    onChange={(e: any) => setOfferType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="option_rights">18-Month Exclusive Option Rights</option>
                    <option value="outright_buyout">Outright Film Rights Purchase</option>
                    <option value="royalty_publishing">Print Publishing & Royalties</option>
                    <option value="adaptation_screenplay">OTT Series Adaptation License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Offer Amount (INR) — {formatCurrency(offerAmount, "INR")}
                  </label>
                  <input
                    type="range"
                    min="500000"
                    max="10000000"
                    step="250000"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>₹5 Lakhs</span>
                    <span>₹50 Lakhs</span>
                    <span>₹1 Crore</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Terms & Conditions Summary</label>
                  <textarea
                    rows={3}
                    value={termsSummary}
                    onChange={(e) => setTermsSummary(e.target.value)}
                    placeholder="Specify payment milestones, option duration, derivative rights..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Binding Offer</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
