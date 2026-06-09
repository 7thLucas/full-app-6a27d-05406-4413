import type { TranscriptionAnalysisOptions } from "../libs/types";

/**
 * Default options sent with every transcribe job (maps to Python `TranscriptionAnalysisOptions`).
 *
 * For the Music Insight Analyzer, the primary analysis flow goes through the
 * agentic LLM endpoint directly (not the transcription scaffold). These defaults
 * apply only when using the raw audio-analyzer transcription routes.
 */
export const defaultAnalysisOptions: TranscriptionAnalysisOptions = {
  context:
    "Music track analysis. Evaluate audio quality, instrumentation, and production characteristics.",
  speaker_roles: ["artist", "vocalist", "other"],
  primary_role: "artist",
  default_role: "artist",
  role_display: {
    artist: "Artist",
    vocalist: "Vocalist",
    other: "Other",
  },
  scoring_rules: [
    {
      id: "production_quality",
      title: "Production Quality",
      rule: "Score 0-{max_score} for overall audio production quality, mix clarity, and mastering.",
      params: { max_score: "100" },
    },
    {
      id: "arrangement_complexity",
      title: "Arrangement Complexity",
      rule: "Score 0-{max_score} for arrangement depth, instrumentation variety, and structural sophistication.",
      params: { max_score: "100" },
    },
  ],
};
