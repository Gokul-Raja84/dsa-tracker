import { useEffect, useState, useRef, useCallback } from "react";
import { TAG_COLORS } from "@/lib/days";
import type { DayInfo, DayProgress, TagName } from "@/lib/types";

interface SlideOverPanelProps {
  isOpen: boolean;
  dayIndex: number;
  day: DayInfo;
  progress: DayProgress | null;
  onClose: () => void;
  onToggleComplete: (dayIndex: number, completed: boolean) => void;
  onSaveNotes: (dayIndex: number, notes: string, leetcodeUrl: string) => void;
}

export default function SlideOverPanel({
  isOpen,
  dayIndex,
  day,
  progress,
  onClose,
  onToggleComplete,
  onSaveNotes,
}: SlideOverPanelProps) {
  const [notes, setNotes] = useState(progress?.notes ?? "");
  const [leetcodeUrl, setLeetcodeUrl] = useState(
    progress?.leetcodeUrl ?? ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync from props when panel opens or progress changes
  useEffect(() => {
    setNotes(progress?.notes ?? "");
    setLeetcodeUrl(progress?.leetcodeUrl ?? "");
  }, [progress, dayIndex]);

  const debouncedSave = useCallback(
    (n: string, url: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSaveNotes(dayIndex, n, url);
      }, 800);
    },
    [dayIndex, onSaveNotes]
  );

  const handleNotesChange = (val: string) => {
    setNotes(val);
    debouncedSave(val, leetcodeUrl);
  };

  const handleUrlChange = (val: string) => {
    setLeetcodeUrl(val);
    debouncedSave(notes, val);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const color = TAG_COLORS[day.tag as TagName];
  const dayNum = String(dayIndex + 1).padStart(2, "0");
  const isCompleted = progress?.completed ?? false;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 transition-opacity duration-200
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        onClick={onClose}
      />

      {/* Panel - desktop: slide from right, mobile: bottom sheet */}
      <div
        ref={panelRef}
        className={`
          fixed z-50 bg-[var(--bg-primary)] border-[var(--border-light)]
          transition-transform duration-200 ease-out
          flex flex-col

          /* Desktop: right panel */
          sm:top-0 sm:right-0 sm:h-full sm:w-[360px] sm:border-l

          /* Mobile: bottom sheet */
          max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:max-h-[85vh]
          max-sm:rounded-t-2xl max-sm:border-t

          ${isOpen
            ? "sm:translate-x-0 max-sm:translate-y-0"
            : "sm:translate-x-full max-sm:translate-y-full"
          }
        `}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--border-mid)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-light)]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[var(--text-secondary)]">
              D{dayNum}
            </span>
            <span
              className="font-mono text-[9px] px-1.5 py-0.5 rounded-[3px] tracking-wide"
              style={{
                borderColor: `${color}44`,
                color: color,
                backgroundColor: `${color}11`,
                border: `0.5px solid ${color}44`,
              }}
            >
              {day.tag}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Topic */}
          <div>
            <label className="font-mono text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-1 block">
              // topic
            </label>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {day.topic}
            </p>
          </div>

          {/* Toggle complete */}
          <div>
            <label className="font-mono text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-2 block">
              // status
            </label>
            <button
              onClick={() => onToggleComplete(dayIndex, !isCompleted)}
              className={`
                font-mono text-[11px] tracking-wide px-4 py-2 rounded-lg
                border transition-all duration-150
                ${isCompleted
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border-mid)] hover:border-[var(--border-strong)]"
                }
              `}
            >
              {isCompleted ? "✓ completed" : "mark complete"}
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="font-mono text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-2 block">
              // notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add your notes here..."
              className="
                w-full h-32 resize-none rounded-lg border border-[var(--border-light)]
                bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)]
                placeholder:text-[var(--text-secondary)] placeholder:opacity-50
                p-3 font-mono text-[12px] leading-relaxed
                focus:outline-none focus:border-[var(--border-mid)]
                transition-colors duration-150
              "
            />
          </div>

          {/* LeetCode URL */}
          <div>
            <label className="font-mono text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-2 block">
              // leetcode url
            </label>
            <input
              type="url"
              value={leetcodeUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="
                w-full rounded-lg border border-[var(--border-light)]
                bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)]
                placeholder:text-[var(--text-secondary)] placeholder:opacity-50
                px-3 py-2 font-mono text-[12px]
                focus:outline-none focus:border-[var(--border-mid)]
                transition-colors duration-150
              "
            />
            {leetcodeUrl && (
              <a
                href={leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-1 mt-2
                  font-mono text-[10px] text-[#378ADD]
                  hover:underline
                "
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M7 3L3 7M7 3H4M7 3V6" />
                </svg>
                open in leetcode
              </a>
            )}
          </div>

          {/* Completed At timestamp */}
          {progress?.completedAt && (
            <div>
              <label className="font-mono text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-1 block">
                // completed at
              </label>
              <p className="font-mono text-[11px] text-[var(--text-secondary)]">
                {new Date(progress.completedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
