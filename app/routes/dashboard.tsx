import { useEffect } from "react";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { AppLayout } from "~/modules/audio-analyzer/src/music-analysis/components/app-layout";
import { AnalysisCard } from "~/modules/audio-analyzer/src/music-analysis/components/analysis-card";
import { GenreChart } from "~/modules/audio-analyzer/src/music-analysis/components/genre-chart";
import { useMusicAnalysisList, useGenreDistribution, useToggleStar } from "~/modules/audio-analyzer/src/music-analysis/hooks/use-music-analysis";
import type { MusicAnalysisRecord } from "~/modules/audio-analyzer/src/music-analysis/hooks/use-music-analysis";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl p-5 music-card" style={{ background: "#1A1A2E" }}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">{label}</p>
      <p className="text-3xl font-bold tabular-nums" style={{ color: color ?? "#F8FAFC" }}>{value}</p>
      {sub && <p className="text-xs text-[#94A3B8] mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { config, loading: configLoading } = useConfigurables();
  const { data, loading: listLoading, refetch: refetchList } = useMusicAnalysisList();
  const { data: genreData, loading: genreLoading, refetch: refetchGenres } = useGenreDistribution();
  const { toggle: toggleStar } = useToggleStar();

  const showHistory = configLoading ? true : (config?.showDashboardHistory ?? true);

  useEffect(() => {
    void refetchList(5, 0);
    void refetchGenres();
  }, [refetchList, refetchGenres]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const completedItems = items.filter((i) => i.status === "completed");

  const avgEnergy = completedItems.length
    ? (completedItems.reduce((s, i) => s + (i.insights?.energy ?? 0), 0) / completedItems.length).toFixed(1)
    : "—";
  const avgCommercial = completedItems.length
    ? (completedItems.reduce((s, i) => s + (i.insights?.commercialAppeal ?? 0), 0) / completedItems.length).toFixed(1)
    : "—";
  const starredCount = items.filter((i) => i.isStarred).length;

  const handleStar = async (id: string) => {
    await toggleStar(id);
    await refetchList(5, 0);
  };

  const handleCardClick = (analysis: MusicAnalysisRecord) => {
    window.location.href = `/analysis/${analysis._id}`;
  };

  return (
    <AppLayout activePage="dashboard">
      <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto pb-20 lg:pb-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#94A3B8] mt-0.5">
            Welcome back{user?.username ? `, ${user.username}` : ""}. Here's your music insight overview.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Analyses" value={total} sub="all time" color="#7C3AED" />
          <StatCard label="Avg Energy" value={avgEnergy} sub="out of 10" color="#3B82F6" />
          <StatCard label="Avg Commercial" value={avgCommercial} sub="appeal score" color="#22C55E" />
          <StatCard label="Starred" value={starredCount} sub="favorite tracks" color="#F59E0B" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent analyses */}
          {showHistory && (
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Recent Analyses</h2>
                <a href="/library" className="text-xs text-[#7C3AED] hover:text-[#9155ff] transition-colors font-medium">
                  View all
                </a>
              </div>

              {listLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-xl shimmer" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-xl p-8 music-card text-center space-y-4" style={{ background: "#1A1A2E" }}>
                  <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                    style={{ background: "rgba(124,58,237,0.15)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#a78bfa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">No analyses yet</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Upload your first track to get started</p>
                  </div>
                  <a
                    href="/"
                    className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
                  >
                    Analyze a Track
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((analysis) => (
                    <AnalysisCard
                      key={analysis._id}
                      analysis={analysis}
                      onStar={handleStar}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Genre distribution */}
          <div className={showHistory ? "lg:col-span-2" : "lg:col-span-5"}>
            <div className="rounded-xl p-5 music-card" style={{ background: "#1A1A2E" }}>
              <h2 className="text-base font-semibold text-white mb-4">Genre Distribution</h2>
              {genreLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 rounded shimmer" />
                  ))}
                </div>
              ) : (
                <GenreChart data={genreData} />
              )}
            </div>

            {/* CTA */}
            <div
              className="mt-4 rounded-xl p-5 text-center space-y-3"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.1))", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <div className="text-2xl">🎵</div>
              <p className="text-sm font-semibold text-white">Ready to analyze?</p>
              <p className="text-xs text-[#94A3B8]">Upload a track and get expert AI feedback in minutes</p>
              <a
                href="/"
                className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
              >
                Analyze Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
