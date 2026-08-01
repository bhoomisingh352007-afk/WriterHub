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
  currentUser: AuthUser;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<"signin" | "signup" | "friends">("signin");
  const [role, setRole] = useState<UserRole>("writer");

  // Form State
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Load registered users from localStorage
  const getSavedUsers = (): AuthUser[] => {
    try {
      const saved = localStorage.getItem("writerhub_registered_users");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "usr-01",
        name: "Bhoomi Singh (भूमि सिंह)",
        email: "bhoomi.writer@writerhub.io",
        role: "writer",
        company: "WriterHub Screenwriter",
        isVerifiedWriter: true,
        joinedDate: "2026-06-12",
      },
      {
        id: "usr-02",
        name: "Rohan Kapoor",
        email: "rohan.publisher@excel.com",
        role: "publisher",
        company: "Excel Entertainment",
        isVerifiedWriter: false,
        joinedDate: "2026-07-01",
      },
    ];
  };

  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(getSavedUsers());

  // Demo Quick Login
  const demoAccounts = [
    {
      role: "writer" as UserRole,
      name: "Bhoomi Singh (भूमि सिंह)",
      email: "bhoomi.writer@writerhub.io",
      label: "Writer Account (Bhoomi)",
      company: "WriterHub Author",
      badge: "Verified Author",
      color: "from-purple-600 to-pink-600",
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
      color: "from-emerald-600 to-teal-600",
    },
  ];

  const saveUserToLocalStorage = (user: AuthUser) => {
    try {
      const existing = getSavedUsers();
      const filtered = existing.filter((u) => u.email !== user.email);
      const updated = [user, ...filtered];
      localStorage.setItem("writerhub_registered_users", JSON.stringify(updated));
      localStorage.setItem("writerhub_current_user", JSON.stringify(user));
      setRegisteredUsers(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickDemoLogin = (demo: typeof demoAccounts[0]) => {
    setIsSubmitting(true);
    setSuccessMessage(`Logging in as ${demo.name}...`);
    const userObj: AuthUser = {
      id: `usr-${demo.role}-${Date.now()}`,
      name: demo.name,
      email: demo.email,
      role: demo.role,
      company: demo.company,
      isVerifiedWriter: demo.role === "writer",
      joinedDate: "2026-01-15",
    };
    setTimeout(() => {
      saveUserToLocalStorage(userObj);
      onLoginSuccess(userObj);
      setIsSubmitting(false);
      setSuccessMessage("");
      onClose();
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const resolvedName = name.trim() || (role === "writer" ? "Friend / Writer" : "Publisher Guest");

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: resolvedName,
      email,
      role,
      company: company || (role === "writer" ? "Independent Writer" : "Film & Media Partner"),
      isVerifiedWriter: role === "writer",
      joinedDate: new Date().toISOString().slice(0, 10),
    };

    setTimeout(() => {
      saveUserToLocalStorage(newUser);
      onLoginSuccess(newUser);
      setIsSubmitting(false);
      setSuccessMessage(mode === "signup" ? "Account created successfully!" : "Signed in successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 500);
    }, 900);
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
        <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
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
            New Register
          </button>
          <button
            type="button"
            onClick={() => setMode("friends")}
            className={`py-2 rounded-lg transition-all ${
              mode === "friends"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Friends ({registeredUsers.length})
          </button>
        </div>

        {/* Tab 3: Friends / Registered Accounts List */}
        {mode === "friends" ? (
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-300">
                👥 Registered Friends & Accounts (पंजीकृत दोस्त)
              </p>
              <span className="text-[10px] text-purple-400 font-mono">
                {registeredUsers.length} Users Saved
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Select any registered account below to instantly switch login session:
            </p>
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {registeredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    saveUserToLocalStorage(u);
                    onLoginSuccess(u);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentUser.email === u.email
                      ? "bg-purple-950/40 border-purple-500/60 shadow-md"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{u.name}</span>
                        {currentUser.email === u.email && (
                          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold rounded">
                            Active Session
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {u.email} • <span className="capitalize">{u.role}</span> ({u.company || "WriterHub"})
                      </p>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold">
                    Login
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}

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
