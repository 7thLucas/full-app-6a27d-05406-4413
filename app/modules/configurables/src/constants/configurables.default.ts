/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  uploadCtaLabel?: string;
  supportedFormatsLabel?: string;
  maxFileSizeMb?: number;
  analysisSteps?: string[];
  footerText?: string;
  showDashboardHistory?: boolean;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Music Insight Analyzer",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#7C3AED",
    secondary: "#3B82F6",
    accent: "#3B82F6",
  },
  tagline: "Expert music feedback, powered by AI",
  heroTitle: "Understand Your Music Like Never Before",
  heroSubtitle:
    "Upload any track and receive an in-depth written analysis — mood, genre, production quality, commercial appeal, and more. Like having a music producer, critic, and marketing expert in your pocket.",
  uploadCtaLabel: "Analyze My Track",
  supportedFormatsLabel: "MP3, WAV, M4A, AAC — up to 50MB",
  maxFileSizeMb: 50,
  analysisSteps: [
    "Extracting audio features…",
    "Analyzing mood and energy…",
    "Detecting genre and instrumentation…",
    "Evaluating commercial appeal…",
    "Generating your expert report…",
  ],
  footerText: "© 2026 Music Insight Analyzer. Built for musicians, by music lovers.",
  showDashboardHistory: true,
};
