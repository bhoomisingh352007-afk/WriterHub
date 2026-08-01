import React from "react";
import { Sparkles, CheckCircle2, X, Feather } from "lucide-react";

interface NotificationToastProps {
  message: string | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-bounce transition-all max-w-md w-full">
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/50 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 border border-purple-400/40 rounded-xl text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center space-x-1 text-xs font-bold text-purple-300">
              <Feather className="w-3.5 h-3.5" />
              <span>WriterHub Update • नया कंटेंट आया है!</span>
            </div>
            <p className="text-xs font-medium text-slate-100 mt-0.5">{message}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
