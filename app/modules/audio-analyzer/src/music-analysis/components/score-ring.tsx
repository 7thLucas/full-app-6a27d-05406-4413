interface ScoreRingProps {
  score: number;
  label: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

function getScoreColor(score: number): string {
  if (score >= 8) return "#22C55E";
  if (score >= 6) return "#3B82F6";
  if (score >= 4) return "#F59E0B";
  return "#EF4444";
}

function getScoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Great";
  if (score >= 5) return "Good";
  if (score >= 3) return "Fair";
  return "Needs Work";
}

export function ScoreRing({ score, label, description, size = "md" }: ScoreRingProps) {
  const clampedScore = Math.max(0, Math.min(10, score));
  const percentage = (clampedScore / 10) * 100;

  const dimensions = { sm: 80, md: 96, lg: 120 };
  const strokeWidths = { sm: 7, md: 8, lg: 10 };
  const dim = dimensions[size];
  const strokeWidth = strokeWidths[size];
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getScoreColor(clampedScore);

  const textSizes = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" };
  const labelSizes = { sm: "text-xs", md: "text-xs", lg: "text-sm" };

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl music-card" style={{ background: "#1A1A2E" }}>
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          {/* Track */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${textSizes[size]} font-bold tabular-nums`} style={{ color }}>
            {clampedScore.toFixed(clampedScore % 1 === 0 ? 0 : 1)}
          </span>
          <span className="text-[10px] text-[#94A3B8] font-medium -mt-0.5">/10</span>
        </div>
      </div>

      <div className="text-center space-y-0.5 w-full">
        <p className={`${labelSizes[size]} font-semibold text-[#F8FAFC] leading-tight`}>{label}</p>
        <p className="text-[10px] font-medium" style={{ color }}>{getScoreLabel(clampedScore)}</p>
        {description && (
          <p className="text-[10px] text-[#94A3B8] leading-relaxed mt-1 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}

interface ScoreBarProps {
  score: number;
  label: string;
  description?: string;
}

export function ScoreBar({ score, label, description }: ScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(10, score));
  const percentage = (clampedScore / 10) * 100;
  const color = getScoreColor(clampedScore);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#F8FAFC]">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold tabular-nums" style={{ color }}>{clampedScore}/10</span>
          <span className="text-xs text-[#94A3B8]">— {getScoreLabel(clampedScore)}</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }}
        />
      </div>
      {description && <p className="text-xs text-[#94A3B8] leading-relaxed">{description}</p>}
    </div>
  );
}
