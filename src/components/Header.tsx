import React from "react";
import { UserRole, AuthUser } from "../types";
import { ShieldCheck, BookOpen, KeyRound, Sparkles, PlusCircle, Lock, Eye, User, LogIn, Feather } from "lucide-react";

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenUploadModal: () => void;
  onOpenAIAssistant: () => void;
  onOpenAuthModal: () => void;
  currentUser: AuthUser;
  pendingRequestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenUploadModal,
  onOpenAIAssistant,
  onOpenAuthModal,
  currentUser,
  pendingRequestsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Security Badge */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 flex items-center justify-center">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white bg-gradient-to-r from-purple-400 via-pink-300 to-white bg-clip-text text-transparent">
                WriterHub
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full flex items-center space-x-1">
                <Lock className="w-3 h-3 text-purple-400" />
                <span>DRM Vault</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              राइटरहब — लेखक (भूमि) एवं प्रकाशक का सुरक्षित डिजिटल अधिकार प्लेटफ़ॉर्म
            </p>
          </div>
        </div>

        {/* Center: Role Navigation */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            id="role-btn-writer"
            onClick={() => onRoleChange("writer")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentRole === "writer"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Writer (लेखक)</span>
            {pendingRequestsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-900 rounded-full text-[10px] font-bold animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            id="role-btn-publisher"
            onClick={() => onRoleChange("publisher")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentRole === "publisher"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Publisher (प्रकाशक)</span>
          </button>

          <button
            id="role-btn-admin"
            onClick={() => onRoleChange("admin")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentRole === "admin"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>DRM Audit</span>
          </button>
        </div>

        {/* Right Actions & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            id="btn-open-ai-script-assistant"
            onClick={onOpenAIAssistant}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-300 rounded-xl text-xs sm:text-sm font-medium transition-colors"
            title="AI Script Evaluator & DRM Risk Check"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">AI Analysis</span>
          </button>

          {currentRole === "writer" && (
            <button
              id="btn-new-manuscript"
              onClick={onOpenUploadModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Encrypt & Add Script</span>
              <span className="lg:hidden">+ Add</span>
            </button>
          )}

          {/* User Profile / Auth Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-purple-500/40 rounded-xl text-xs font-semibold text-slate-200 transition-all group"
            title="User Profile & Auth Options"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-emerald-500 flex items-center justify-center text-white text-[11px] font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-white leading-tight group-hover:text-purple-300">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight capitalize">{currentUser.role} • Auth Active</p>
            </div>
            <LogIn className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform ml-1" />
          </button>
        </div>
      </div>
    </header>
  );
};

