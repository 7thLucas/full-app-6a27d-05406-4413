import { useState } from "react";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { AppLayout } from "~/modules/audio-analyzer/src/music-analysis/components/app-layout";
import { MusicUploadZone } from "~/modules/audio-analyzer/src/music-analysis/components/music-upload-zone";
import { MusicReport } from "~/modules/audio-analyzer/src/music-analysis/components/music-report";
import { useCreateMusicAnalysis } from "~/modules/audio-analyzer/src/music-analysis/hooks/use-music-analysis";
import type { MusicAnalysisRecord } from "~/modules/audio-analyzer/src/music-analysis/hooks/use-music-analysis";

function AnalysisProgress({ steps }: { steps?: string[] }) {
  const defaultSteps = [
    "Extracting audio features…",
    "Analyzing mood and energy…",
    "Detecting genre and instrumentation…",
    "Evaluating commercial appeal…",
    "Generating your expert report…",
  ];
  const activeSteps = steps?.length ? steps : defaultSteps;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Equalizer animation */}
      <div className="flex items-end gap-[4px] h-10">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div
            key={n}
            className={`w-1.5 rounded-full eq-bar-${((n - 1) % 5) + 1}`}
            style={{
              background: `linear-gradient(to top, #7C3AED, #3B82F6)`,
              minHeight: 6,
            }}
          />
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-white">Analyzing your track…</p>
        <p className="text-sm text-[#94A3B8]">Our AI is diving deep into your music</p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        {activeSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm text-[#94A3B8]">
            <div className="w-4 h-4 rounded-full border-2 shrink-0 animate-pulse"
              style={{ borderColor: "#7C3AED", background: "rgba(124,58,237,0.2)" }} />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingHero() {
  const { config, loading } = useConfigurables();

  const heroTitle = loading ? "Understand Your Music Like Never Before" : (config?.heroTitle ?? "Understand Your Music Like Never Before");
  const heroSubtitle = loading
    ? "Upload any track and receive an in-depth written analysis — mood, genre, production quality, and more."
    : (config?.heroSubtitle ?? "Upload any track and receive an in-depth written analysis — mood, genre, production quality, and more.");
  const uploadCta = loading ? "Analyze My Track" : (config?.uploadCtaLabel ?? "Analyze My Track");
  const formatsLabel = loading ? "MP3, WAV, M4A, AAC — up to 50MB" : (config?.supportedFormatsLabel ?? "MP3, WAV, M4A, AAC — up to 50MB");

  return (
    <div className="text-center space-y-4 mb-10">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
        {heroTitle.split("Music").length > 1 ? (
          <>
            {heroTitle.split("Music")[0]}
            <span className="gradient-text">Music</span>
            {heroTitle.split("Music").slice(1).join("Music")}
          </>
        ) : (
          <span>{heroTitle}</span>
        )}
      </h1>
      <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
        {heroSubtitle}
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-[#94A3B8]">
        {[
          { icon: "🎵", text: "Genre Detection" },
          { icon: "🎭", text: "Mood Analysis" },
          { icon: "🎛️", text: "Production Quality" },
          { icon: "📈", text: "Commercial Appeal" },
        ].map(({ icon, text }) => (
          <span key={text} className="flex items-center gap-1.5">
            <span>{icon}</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function IndexPage() {
  const { isAuthenticated } = useAuth();
  const { config, loading } = useConfigurables();
  const { analyze, loading: analyzing, error } = useCreateMusicAnalysis();
  const [result, setResult] = useState<MusicAnalysisRecord | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const analysisSteps = loading ? undefined : (config?.analysisSteps as string[] | undefined);

  const handleUpload = async (file: File) => {
    setUploadedFileName(file.name);
    setResult(null);
    const data = await analyze(file);
    if (data) {
      setResult(data);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUploadedFileName(null);
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ background: "linear-gradient(135deg, #0F0F1A 0%, #110F20 50%, #0F0F1A 100%)" }}
      >
        <div className="w-full max-w-3xl space-y-10">
          <LandingHero />

          <div
            className="rounded-2xl p-8 music-card text-center space-y-4"
            style={{ background: "#1A1A2E" }}
          >
            <p className="text-base text-[#94A3B8]">
              Create a free account to start analyzing your music
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/auth/register"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
              >
                Get Started Free
              </a>
              <a
                href="/auth/login"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-white/5"
                style={{ color: "#94A3B8", borderColor: "rgba(124,58,237,0.3)" }}
              >
                Sign In
              </a>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "16+ Insights",
                desc: "Mood, genre, tempo, instrumentation, vocals, structure, and more",
                icon: "🔍",
              },
              {
                title: "AI-Powered",
                desc: "Expert-level feedback written in natural language, not raw metrics",
                icon: "🤖",
              },
              {
                title: "Actionable Advice",
                desc: "Specific strengths and concrete improvement suggestions every time",
                icon: "🎯",
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="rounded-xl p-5 music-card text-center" style={{ background: "#1A1A2E" }}>
                <div className="text-2xl mb-2">{icon}</div>
                <p className="text-sm font-semibold text-white mb-1">{title}</p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout activePage="analyze">
      <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto pb-20 lg:pb-8">
        {!result && !analyzing && (
          <>
            <LandingHero />

            <MusicUploadZone
              onUpload={handleUpload}
              isLoading={analyzing}
              label={loading ? "Drop your track here" : (config?.uploadCtaLabel ?? "Drop your track here")}
              hint="or click to browse your files"
            />

            {error && (
              <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">
                {error}
              </div>
            )}
          </>
        )}

        {analyzing && (
          <div className="rounded-2xl p-8 music-card" style={{ background: "#1A1A2E" }}>
            {uploadedFileName && (
              <p className="text-center text-sm text-[#94A3B8] mb-6">
                Analyzing: <span className="text-white font-medium">{uploadedFileName}</span>
              </p>
            )}
            <AnalysisProgress steps={analysisSteps} />
          </div>
        )}

        {result && !analyzing && (
          <div className="space-y-6">
            {/* Report header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{result.fileName}</h2>
                <p className="text-sm text-[#94A3B8] mt-0.5">
                  Analysis complete •{" "}
                  {new Date(result.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/analysis/${result._id}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:bg-white/5"
                  style={{ color: "#94A3B8", borderColor: "rgba(124,58,237,0.3)" }}
                >
                  Full Report
                </a>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
                >
                  Analyze Another
                </button>
              </div>
            </div>

            {result.status === "failed" ? (
              <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-center space-y-3">
                <p className="text-base font-semibold text-red-400">Analysis Failed</p>
                <p className="text-sm text-red-400/80">{result.errorMessage ?? "An error occurred during analysis. Please try again."}</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "#7C3AED" }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <MusicReport analysis={result} />
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
