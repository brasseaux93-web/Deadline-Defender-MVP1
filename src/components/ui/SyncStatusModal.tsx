"use client";

import { X, RefreshCw, Server, AlertCircle, Database } from "lucide-react";
import { useEffect } from "react";

interface SyncStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SyncStatusModal({ isOpen, onClose }: SyncStatusModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">Integration Status</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-900/50 border border-white/5">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Last Sync</span>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-zinc-300" />
                <span className="text-sm text-white font-medium">2 minutes ago</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-900/50 border border-white/5">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Overall Health</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-white font-medium">Healthy</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-300">Pending Connections</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-md bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-white">King County E-Filing</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-white">LINX System</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Active</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300">Error Logs</h3>
              <span className="text-xs text-zinc-500">Last 24 hours</span>
            </div>
            <div className="h-32 bg-black rounded-md border border-white/5 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed">
              <div className="text-emerald-500/80">[09:41:22] [INFO] Heartbeat acknowledged (12ms)</div>
              <div className="text-emerald-500/80">[09:42:05] [INFO] Polling KC District updates... 0 new cases.</div>
              <div className="text-amber-500/80 flex items-start gap-2 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                <span>[09:45:12] [WARN] Rate limit approaching for LINX API. Throttling requests.</span>
              </div>
              <div className="text-emerald-500/80 mt-1">[09:48:00] [INFO] Sync cycle completed successfully.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
