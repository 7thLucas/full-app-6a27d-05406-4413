const CHART_COLORS = ["#7C3AED", "#3B82F6", "#22C55E", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4", "#F97316"];

interface GenreChartProps {
  data: Array<{ genre: string; count: number }>;
}

export function GenreChart({ data }: GenreChartProps) {
  if (!data.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[#94A3B8]">No genre data yet. Analyze some tracks to see your distribution.</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const pct = (item.count / maxCount) * 100;
        const color = CHART_COLORS[i % CHART_COLORS.length];
        return (
          <div key={item.genre} className="flex items-center gap-3">
            <div className="w-32 shrink-0 text-sm text-[#F8FAFC] font-medium truncate">{item.genre}</div>
            <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                style={{ width: `${pct}%`, background: `${color}60`, borderRight: `2px solid ${color}` }}
              />
            </div>
            <div className="w-6 text-right text-sm font-bold tabular-nums text-[#94A3B8] shrink-0">
              {item.count}
            </div>
          </div>
        );
      })}
    </div>
  );
}
