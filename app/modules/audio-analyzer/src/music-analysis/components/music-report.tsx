import type { MusicAnalysisRecord } from "../hooks/use-music-analysis";
import { ScoreRing, ScoreBar } from "./score-ring";

interface MusicReportProps {
  analysis: MusicAnalysisRecord;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
      {children}
    </h3>
  );
}

function InsightSection({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4 space-y-2 music-card" style={{ background: "#1A1A2E" }}>
      <div className="flex items-center gap-2">
        {icon && <div className="text-[#7C3AED] shrink-0">{icon}</div>}
        <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">{title}</p>
      </div>
      <p className="text-base font-semibold text-white">{value}</p>
      <p className="text-sm text-[#94A3B8] leading-relaxed">{description}</p>
    </div>
  );
}

export function MusicReport({ analysis }: MusicReportProps) {
  const insights = analysis.insights;

  if (!insights) {
    return (
      <div className="text-center py-12 text-[#94A3B8]">
        <p>No insights available for this analysis.</p>
      </div>
    );
  }

  const scoreItems = [
    { label: "Energy", score: insights.energy, desc: insights.energyDescription },
    { label: "Danceability", score: insights.danceability, desc: insights.danceabilityDescription },
    { label: "Commercial Appeal", score: insights.commercialAppeal, desc: insights.commercialAppealDescription },
    { label: "Production Quality", score: insights.productionQuality, desc: insights.productionQualityDescription },
    { label: "Focus Suitability", score: insights.focusSuitability, desc: insights.focusSuitabilityDescription },
    { label: "Workout Score", score: insights.workoutSuitability, desc: insights.workoutSuitabilityDescription },
  ];

  return (
    <div className="space-y-8">
      {/* Producer Review Hero */}
      <div
        className="rounded-2xl p-6 music-card relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))", borderColor: "rgba(124,58,237,0.25)" }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="relative space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Producer's Verdict</p>
          </div>
          <p className="text-base text-[#F8FAFC] leading-7">{insights.producerReview}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-full text-sm font-semibold text-white"
              style={{ background: "rgba(124,58,237,0.4)" }}>
              {insights.mood}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium text-[#94A3B8] border"
              style={{ borderColor: "rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.1)" }}>
              {insights.genre}
            </span>
          </div>
        </div>
      </div>

      {/* Score Grid */}
      <div>
        <SectionHeading>Scores</SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {scoreItems.map((item) => (
            <ScoreRing
              key={item.label}
              score={item.score}
              label={item.label}
              description={item.desc}
              size="md"
            />
          ))}
        </div>
      </div>

      {/* Score Bars for detail */}
      <div className="rounded-xl p-5 music-card" style={{ background: "#1A1A2E" }}>
        <SectionHeading>Score Breakdown</SectionHeading>
        <div className="space-y-4">
          {scoreItems.map((item) => (
            <ScoreBar key={item.label} score={item.score} label={item.label} description={item.desc} />
          ))}
        </div>
      </div>

      {/* Mood & Genre */}
      <div>
        <SectionHeading>Character</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InsightSection
            title="Mood & Emotion"
            value={insights.mood}
            description={insights.moodDescription}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            }
          />
          <InsightSection
            title="Genre"
            value={insights.genre}
            description={insights.genreDescription}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            }
          />
          <InsightSection
            title="Tempo & Pacing"
            value={insights.tempo}
            description={insights.tempoDescription}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            }
          />
          <InsightSection
            title="Song Structure"
            value={insights.songStructure}
            description={insights.songStructureDescription}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
              </svg>
            }
          />
        </div>
      </div>

      {/* Instrumentation & Vocals */}
      <div>
        <SectionHeading>Sound & Production</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-5 music-card space-y-3" style={{ background: "#1A1A2E" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Instrumentation</p>
            <div className="flex flex-wrap gap-2">
              {(insights.instrumentation ?? []).map((inst) => (
                <span
                  key={inst}
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.25)" }}
                >
                  {inst}
                </span>
              ))}
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed">{insights.instrumentationDescription}</p>
          </div>

          <div className="rounded-xl p-5 music-card space-y-3" style={{ background: "#1A1A2E" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Vocals</p>
            <p className="text-sm font-semibold text-white">{insights.vocals}</p>
            <p className="text-sm text-[#94A3B8] leading-relaxed">{insights.vocalsDescription}</p>
          </div>
        </div>
      </div>

      {/* Strengths vs Improvements */}
      <div>
        <SectionHeading>Feedback</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-5 music-card" style={{ background: "#1A1A2E", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.15)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#22C55E]">Strengths</p>
            </div>
            <ul className="space-y-2.5">
              {(insights.strengths ?? []).map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#94A3B8] leading-relaxed">
                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl p-5 music-card" style={{ background: "#1A1A2E", border: "1px solid rgba(245,158,11,0.2)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.15)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#F59E0B]">Areas to Improve</p>
            </div>
            <ul className="space-y-2.5">
              {(insights.improvements ?? []).map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#94A3B8] leading-relaxed">
                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Artists & Audience */}
      <div>
        <SectionHeading>Context & Audience</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-5 music-card space-y-3" style={{ background: "#1A1A2E" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Similar Artists</p>
            <div className="flex flex-wrap gap-2">
              {(insights.similarArtists ?? []).map((artist) => (
                <span
                  key={artist}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.25)" }}
                >
                  {artist}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5 music-card space-y-3" style={{ background: "#1A1A2E" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Ideal Listener Profile</p>
            <p className="text-sm text-[#94A3B8] leading-relaxed">{insights.audienceProfile}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
