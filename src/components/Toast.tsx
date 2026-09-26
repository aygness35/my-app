import React from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgStyles = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    error: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    info: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  };

  const icons = {
    success: "✅",
    error: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-bounce">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 border backdrop-blur-xl rounded-2xl shadow-2xl text-xs font-semibold ${bgStyles[type]}`}
      >
        <span>{icons[type]}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
