import { useEffect } from "react";
import { useParams, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppLayout } from "~/modules/audio-analyzer/src/music-analysis/components/app-layout";
import { MusicReport } from "~/modules/audio-analyzer/src/music-analysis/components/music-report";
import { useMusicAnalysisDetail } from "~/modules/audio-analyzer/src/music-analysis/hooks/use-music-analysis";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 rounded-lg shimmer w-64" />
      <div className="h-40 rounded-2xl shimmer" />
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-48 rounded-xl shimmer" />
        <div className="h-48 rounded-xl shimmer" />
      </div>
    </div>
  );
}

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useMusicAnalysisDetail(id ?? null);

  useEffect(() => {
    if (id) {
      void refetch();
    }
  }, [id, refetch]);

  return (
    <AppLayout activePage="library">
      <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto pb-20 lg:pb-8">
        {/* Back button */}
        <div className="mb-6">
          <a
            href="/library"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Library
          </a>
        </div>

        {loading && <LoadingSkeleton />}

        {error && !loading && (
          <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-center space-y-2">
            <p className="text-base font-semibold text-red-400">Failed to load analysis</p>
            <p className="text-sm text-red-400/80">{error}</p>
            <button
              onClick={() => void refetch()}
              className="mt-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: "#7C3AED" }}
            >
              Retry
            </button>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{data.fileName}</h1>
                <p className="text-sm text-[#94A3B8] mt-0.5">
                  {new Date(data.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {data.fileSizeBytes && ` · ${(data.fileSizeBytes / 1024 / 1024).toFixed(1)} MB`}
                </p>
              </div>
              <div className="flex gap-2">
                {data.status === "completed" && (
                  <a
                    href="/"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
                  >
                    Analyze New Track
                  </a>
                )}
              </div>
            </div>

            {data.status === "failed" ? (
              <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-center space-y-2">
                <p className="text-base font-semibold text-red-400">Analysis Failed</p>
                <p className="text-sm text-red-400/80">{data.errorMessage}</p>
              </div>
            ) : data.status !== "completed" ? (
              <div className="p-8 rounded-2xl music-card text-center space-y-4" style={{ background: "#1A1A2E" }}>
                <div className="flex items-end justify-center gap-[4px] h-8">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`w-1.5 rounded-full eq-bar-${n}`}
                      style={{ background: "linear-gradient(to top, #7C3AED, #3B82F6)", minHeight: 6 }}
                    />
                  ))}
                </div>
                <p className="text-base text-[#94A3B8]">Analysis in progress…</p>
              </div>
            ) : (
              <MusicReport analysis={data} />
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
