import type { MusicAnalysisRecord } from "../hooks/use-music-analysis";

interface AnalysisCardProps {
  analysis: MusicAnalysisRecord;
  onStar?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (analysis: MusicAnalysisRecord) => void;
}

const STATUS_CONFIG = {
  completed: { label: "Completed", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  processing: { label: "Processing", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  pending: { label: "Pending", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  failed: { label: "Failed", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export function AnalysisCard({ analysis, onStar, onDelete, onClick }: AnalysisCardProps) {
  const statusConfig = STATUS_CONFIG[analysis.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const insights = analysis.insights;

  return (
    <div
      className="rounded-xl p-4 music-card cursor-pointer group transition-all"
      style={{ background: "#1A1A2E" }}
      onClick={() => onClick?.(analysis)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick?.(analysis); }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: file info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.15)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#a78bfa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{analysis.fileName}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {insights?.genre && (
                <span className="text-xs text-[#94A3B8]">{insights.genre.split("/")[0].trim()}</span>
              )}
              {analysis.fileSizeBytes && (
                <span className="text-xs text-[#94A3B8]/60">{formatFileSize(analysis.fileSizeBytes)}</span>
              )}
              <span className="text-xs text-[#94A3B8]/60">{formatDate(analysis.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right: status + actions */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: statusConfig.bg, color: statusConfig.color }}
          >
            {statusConfig.label}
          </span>

          {onStar && (
            <button
              onClick={() => onStar(analysis._id)}
              title={analysis.isStarred ? "Unstar" : "Star"}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill={analysis.isStarred ? "#F59E0B" : "none"}
                stroke={analysis.isStarred ? "#F59E0B" : "#94A3B8"}
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(analysis._id)}
              title="Delete"
              className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 text-[#94A3B8] hover:text-[#EF4444]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Quick scores preview (completed only) */}
      {analysis.status === "completed" && insights && (
        <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-3" style={{ borderColor: "rgba(124,58,237,0.1)" }}>
          {[
            { label: "Energy", value: insights.energy },
            { label: "Danceability", value: insights.danceability },
            { label: "Commercial", value: insights.commercialAppeal },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-base font-bold tabular-nums" style={{
                color: value >= 8 ? "#22C55E" : value >= 6 ? "#3B82F6" : value >= 4 ? "#F59E0B" : "#EF4444"
              }}>
                {value}/10
              </div>
              <div className="text-[10px] text-[#94A3B8]">{label}</div>
            </div>
          ))}
        </div>
      )}

      {analysis.status === "failed" && analysis.errorMessage && (
        <p className="mt-2 text-xs text-red-400/80 line-clamp-2">{analysis.errorMessage}</p>
      )}
    </div>
  );
}
