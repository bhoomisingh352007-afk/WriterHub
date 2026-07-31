import React, { useState } from "react";
import { AuthUser, UserRole } from "../types";
import {
  X,
  Lock,
  UserCheck,
  Building2,
  ShieldCheck,
  KeyRound,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  LogIn,
  Feather,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<UserRole>("writer");

  // Form State
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Demo Accounts
  const demoAccounts = [
    {
      role: "writer" as UserRole,
      name: "Bhoomi Singh (भूमि सिंह)",
      email: "bhoomi.writer@writerhub.io",
      label: "Writer Account (Bhoomi)",
      company: "Independent Screenwriter",
      badge: "Verified Author",
      color: "from-emerald-600 to-teal-600",
    },
    {
      role: "publisher" as UserRole,
      name: "Rohan Kapoor",
      email: "rohan.publisher@excel.com",
      label: "Publisher Account",
      company: "Excel Entertainment",
      badge: "Acquisitions Director",
      color: "from-blue-600 to-indigo-600",
    },
    {
      role: "admin" as UserRole,
      name: "WriterHub Vault Admin",
      email: "vault.admin@writerhub.io",
      label: "DRM Audit Admin",
      company: "WriterHub Security Desk",
      badge: "AES-256 System Officer",
      color: "from-purple-600 to-pink-600",
    },
  ];

  const handleQuickDemoLogin = (demo: typeof demoAccounts[0]) => {
    setIsSubmitting(true);
    setSuccessMessage(`Logging in as ${demo.name}...`);
    setTimeout(() => {
      onLoginSuccess({
        id: `usr-${Date.now()}`,
        name: demo.name,
        email: demo.email,
        role: demo.role,
        company: demo.company,
        isVerifiedWriter: demo.role === "writer",
        joinedDate: "2026-01-15",
      });
      setIsSubmitting(false);
      setSuccessMessage("");
      onClose();
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const resolvedName = name || (role === "writer" ? "Bhoomi Singh" : "Industry Professional");

    setTimeout(() => {
      onLoginSuccess({
        id: `usr-${Date.now()}`,
        name: resolvedName,
        email,
        role,
        company: company || (role === "writer" ? "WriterHub Originals" : "Media Production"),
        isVerifiedWriter: role === "writer",
        joinedDate: new Date().toISOString().slice(0, 10),
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-xs font-semibold">
            <Feather className="w-3.5 h-3.5 text-purple-400" />
            <span>WriterHub Auth System • राइटराहब लॉगिन</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pt-1">
            {mode === "signin" ? "Sign In to WriterHub" : "Create WriterHub Account"}
          </h2>
          <p className="text-slate-400 text-xs">
            {mode === "signin"
              ? "Access your encrypted manuscripts, DRM security vault, and publisher offers."
              : "Protect your screenplays and novels with AES-256 DRM watermarks."}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`py-2 rounded-lg transition-all ${
              mode === "signin"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In (लॉगिन)
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`py-2 rounded-lg transition-all ${
              mode === "signup"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account (रजिस्टर)
          </button>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            ⚡ Quick One-Click Demo Sign-In:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() => handleQuickDemoLogin(demo)}
                disabled={isSubmitting}
                className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}
                  >
                    {demo.role === "writer" ? "B" : demo.role === "publisher" ? "P" : "A"}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-white group-hover:text-purple-300">
                        {demo.name}
                      </span>
                      <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] text-slate-300 rounded font-mono">
                        {demo.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{demo.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-slate-400 group-hover:text-purple-400 text-xs font-semibold">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-medium absolute">
            OR USE EMAIL / OAUTH
          </span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Role Choice for Signup/Signin */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Your Role</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("writer")}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 border transition-all ${
                  role === "writer"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Writer (लेखक)</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("publisher")}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 border transition-all ${
                  role === "publisher"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Publisher</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 border transition-all ${
                  role === "admin"
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DRM Admin</span>
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name (नाम)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "writer" ? "e.g. Bhoomi Singh (भूमि सिंह)" : "e.g. Rahul Sharma"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "writer" ? "bhoomi.writer@writerhub.io" : "user@company.com"}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {successMessage && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 animate-bounce" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {isSubmitting
                ? "Authenticating..."
                : mode === "signin"
                ? "Sign In to WriterHub"
                : "Create Secure Writer Account"}
            </span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Protected by WriterHub 256-Bit Zero Knowledge Cryptographic Session Keys.
          </p>
        </div>
      </div>
    </div>
  );
};
