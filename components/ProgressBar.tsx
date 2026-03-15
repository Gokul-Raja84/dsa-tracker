interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <div className="flex-1 h-[5px] bg-[var(--border-light)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--text-primary)] rounded-full transition-all duration-400 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="font-mono text-xs text-[var(--text-secondary)] min-w-[34px] text-right">
        {percentage}%
      </div>
    </div>
  );
}
