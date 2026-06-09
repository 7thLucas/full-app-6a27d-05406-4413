import { useEffect, useState, useCallback } from "react";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/modules/audio-analyzer/src/music-analysis/components/app-layout";
import { AnalysisCard } from "~/modules/audio-analyzer/src/music-analysis/components/analysis-card";
import {
  useMusicAnalysisList,
  useToggleStar,
  useDeleteAnalysis,
} from "~/modules/audio-analyzer/src/music-analysis/hooks/use-music-analysis";
import type { MusicAnalysisRecord } from "~/modules/audio-analyzer/src/music-analysis/hooks/use-music-analysis";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

type FilterType = "all" | "completed" | "starred" | "failed";

export default function LibraryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  const { data, loading, refetch } = useMusicAnalysisList();
  const { toggle: toggleStar } = useToggleStar();
  const { remove: deleteAnalysis } = useDeleteAnalysis();

  const fetchPage = useCallback(
    (pageNum: number) => {
      void refetch(PAGE_SIZE, pageNum * PAGE_SIZE);
    },
    [refetch],
  );

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  const handleStar = async (id: string) => {
    await toggleStar(id);
    fetchPage(page);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this analysis? This cannot be undone.")) return;
    await deleteAnalysis(id);
    fetchPage(page);
  };

  const handleCardClick = (analysis: MusicAnalysisRecord) => {
    window.location.href = `/analysis/${analysis._id}`;
  };

  const allItems = data?.items ?? [];
  const total = data?.total ?? 0;

  const filteredItems = allItems.filter((item) => {
    if (filter === "completed") return item.status === "completed";
    if (filter === "starred") return item.isStarred;
    if (filter === "failed") return item.status === "failed";
    return true;
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const FILTERS: Array<{ id: FilterType; label: string }> = [
    { id: "all", label: "All" },
    { id: "completed", label: "Completed" },
    { id: "starred", label: "Starred" },
    { id: "failed", label: "Failed" },
  ];

  return (
    <AppLayout activePage="library">
      <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto pb-20 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Music Library</h1>
            <p className="text-sm text-[#94A3B8] mt-0.5">{total} track{total !== 1 ? "s" : ""} analyzed</p>
          </div>
          <a
            href="/"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
          >
            + Analyze Track
          </a>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={
                filter === f.id
                  ? { background: "rgba(124,58,237,0.3)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.4)" }
                  : { background: "rgba(255,255,255,0.04)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl shimmer" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.1)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <p className="text-base font-semibold text-white">
              {filter === "all" ? "No tracks analyzed yet" : `No ${filter} tracks`}
            </p>
            <p className="text-sm text-[#94A3B8]">
              {filter === "all"
                ? "Upload your first track to get started"
                : "Try a different filter"}
            </p>
            {filter === "all" && (
              <a
                href="/"
                className="inline-block px-5 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
              >
                Analyze a Track
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((analysis) => (
                <AnalysisCard
                  key={analysis._id}
                  analysis={analysis}
                  onStar={handleStar}
                  onDelete={handleDelete}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => { setPage(page - 1); fetchPage(page - 1); }}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#94A3B8" }}
                >
                  Previous
                </button>
                <span className="text-sm text-[#94A3B8]">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => { setPage(page + 1); fetchPage(page + 1); }}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#94A3B8" }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
