"use client";

import { useEffect, useState } from "react";
import type { DayData, DayProgress } from "./Tracker";

export default function SlidePanel({
  isOpen,
  onClose,
  day,
  progress,
  onToggle,
  onSaveNotes,
}: {
  isOpen: boolean;
  onClose: () => void;
  day: DayData | null;
  progress: DayProgress | null;
  onToggle: () => void;
  onSaveNotes: (notes: string, url: string) => void;
}) {
  const [notesSync, setNotesSync] = useState("");
  const [urlSync, setUrlSync] = useState("");

  useEffect(() => {
    if (progress) {
      setNotesSync(progress.notes || "");
      setUrlSync(progress.leetcodeUrl || "");
    } else {
      setNotesSync("");
      setUrlSync("");
    }
  }, [progress, day]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      const pNotes = progress?.notes || "";
      const pUrl = progress?.leetcodeUrl || "";
      if (notesSync !== pNotes || urlSync !== pUrl) {
         onSaveNotes(notesSync, urlSync);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [notesSync, urlSync, isOpen, progress, onSaveNotes]);

  if (!isOpen || !day) return null;

  const isCompleted = progress?.completed || false;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 lg:hidden" 
        onClick={onClose}
      />
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-[320px] z-50 glass-panel shadow-2xl flex flex-col transform transition-transform duration-300"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="p-6 glass-divider flex justify-between items-start">
           <div>
             <div className="font-sans font-extrabold text-4xl text-white mb-1">{day.id}</div>
             <div className="font-mono text-sm text-amber uppercase">{day.tag}</div>
           </div>
           <button onClick={onClose} className="text-muted hover:text-white font-mono text-xl transition-colors p-2 -mr-2 -mt-2">
             ✕
           </button>
        </div>

        {/* Topic */}
        <div className="p-6 glass-divider font-mono text-lg text-white">
          {day.topic}
        </div>

        {/* Status Toggle */}
        <div className="p-6 glass-divider flex justify-between items-center cursor-pointer group hover:bg-white/5 transition-colors" onClick={onToggle}>
          <span className="font-mono text-muted uppercase text-sm group-hover:text-white transition-colors">
            Status
          </span>
          <div className="flex items-center gap-2">
             <span className={`font-mono text-sm ${isCompleted ? 'text-success' : 'text-amber'}`}>
               {isCompleted ? "COMPLETED" : "PENDING"}
             </span>
             <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${isCompleted ? 'border-success bg-success/20' : 'border-amber bg-transparent'}`}>
                {isCompleted && <span className="text-success text-xs">✓</span>}
             </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="p-6 flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-muted uppercase">Resource / LeetCode URL</label>
            <input 
              type="text" 
              value={urlSync}
              onChange={(e) => setUrlSync(e.target.value)}
              className="w-full bg-primary/20 border border-border px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-amber transition-colors"
              placeholder="https://leetcode.com/..."
            />
          </div>

          <div className="flex flex-col gap-2 flex-1 relative">
            <label className="font-mono text-xs text-muted uppercase">Terminal Notes</label>
            <textarea 
              value={notesSync}
              onChange={(e) => setNotesSync(e.target.value)}
              className="w-full flex-1 bg-primary/20 border border-border px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-amber transition-colors resize-none mb-4 min-h-[150px]"
              placeholder="// drop insights here..."
            />
          </div>
        </div>
      </div>
    </>
  );
}
