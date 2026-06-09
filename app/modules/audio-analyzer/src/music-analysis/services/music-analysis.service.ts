import { MusicAnalysisModel } from "../models/music-analysis.model";
import type { MusicInsightData } from "../models/music-analysis.model";

export const MUSIC_INSIGHT_SCHEMA = {
  type: "object",
  properties: {
    producerReview: {
      type: "string",
      description:
        "A compelling 3-5 sentence paragraph written in the voice of an experienced music producer giving holistic feedback on this track. Be specific, insightful, and encouraging.",
    },
    mood: {
      type: "string",
      description:
        "Primary mood in 1-3 words (e.g., 'Melancholic & Introspective', 'Energetic & Euphoric', 'Dark & Intense')",
    },
    moodDescription: {
      type: "string",
      description: "2-3 sentences describing the emotional quality and feel of the track",
    },
    genre: {
      type: "string",
      description: "Primary genre and sub-genre (e.g., 'Indie Folk / Singer-Songwriter', 'Electronic / Deep House')",
    },
    genreDescription: {
      type: "string",
      description: "2-3 sentences on the genre characteristics present in this track",
    },
    tempo: {
      type: "string",
      description: "Tempo description with estimated BPM range if detectable (e.g., 'Mid-tempo, approx 95-105 BPM')",
    },
    tempoDescription: {
      type: "string",
      description: "1-2 sentences on how the tempo affects the track's feel and purpose",
    },
    energy: {
      type: "number",
      description: "Energy level score 1-10 (1=very calm/ambient, 10=extremely intense)",
    },
    energyDescription: { type: "string", description: "1-2 sentences explaining the energy score" },
    danceability: {
      type: "number",
      description: "Danceability score 1-10 (1=not danceable, 10=perfect for the dance floor)",
    },
    danceabilityDescription: { type: "string", description: "1-2 sentences explaining the danceability score" },
    commercialAppeal: {
      type: "number",
      description: "Commercial appeal score 1-10 (1=very niche/experimental, 10=mass market radio-ready)",
    },
    commercialAppealDescription: {
      type: "string",
      description: "2-3 sentences explaining the commercial appeal assessment",
    },
    productionQuality: {
      type: "number",
      description: "Production quality score 1-10 (1=rough demo, 10=world-class professional production)",
    },
    productionQualityDescription: {
      type: "string",
      description: "2-3 sentences on production quality observations",
    },
    instrumentation: {
      type: "array",
      items: { type: "string" },
      description: "List of detected instruments and sound elements",
    },
    instrumentationDescription: {
      type: "string",
      description: "2-3 sentences describing the instrumentation",
    },
    vocals: {
      type: "string",
      description:
        "Vocal presence and characteristics (e.g., 'Lead male vocals, smooth mid-range, layered harmonies' or 'Instrumental — no vocals detected')",
    },
    vocalsDescription: {
      type: "string",
      description: "2-3 sentences on the vocals and their role",
    },
    songStructure: {
      type: "string",
      description: "Detected song structure (e.g., 'Intro → Verse → Pre-Chorus → Chorus → Verse → Chorus → Bridge → Outro')",
    },
    songStructureDescription: {
      type: "string",
      description: "2-3 sentences analyzing the song structure",
    },
    focusSuitability: {
      type: "number",
      description: "Focus/relaxation suitability score 1-10 (1=too distracting, 10=perfect for focused work)",
    },
    focusSuitabilityDescription: { type: "string", description: "1-2 sentences on focus/relaxation context suitability" },
    workoutSuitability: {
      type: "number",
      description: "Workout suitability score 1-10 (1=totally unsuitable, 10=perfect gym anthem)",
    },
    workoutSuitabilityDescription: { type: "string", description: "1-2 sentences on workout suitability" },
    similarArtists: {
      type: "array",
      items: { type: "string" },
      description: "3-5 similar artists or acts this track reminds you of",
    },
    audienceProfile: {
      type: "string",
      description: "2-3 sentences describing the ideal listener profile",
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "3-5 specific strengths of this track as complete sentences",
    },
    improvements: {
      type: "array",
      items: { type: "string" },
      description: "3-5 specific, constructive suggestions for improvement as complete sentences",
    },
  },
  required: [
    "producerReview",
    "mood",
    "moodDescription",
    "genre",
    "genreDescription",
    "tempo",
    "tempoDescription",
    "energy",
    "energyDescription",
    "danceability",
    "danceabilityDescription",
    "commercialAppeal",
    "commercialAppealDescription",
    "productionQuality",
    "productionQualityDescription",
    "instrumentation",
    "instrumentationDescription",
    "vocals",
    "vocalsDescription",
    "songStructure",
    "songStructureDescription",
    "focusSuitability",
    "focusSuitabilityDescription",
    "workoutSuitability",
    "workoutSuitabilityDescription",
    "similarArtists",
    "audienceProfile",
    "strengths",
    "improvements",
  ],
};

export const MUSIC_SYSTEM_PROMPT = `You are an expert music analyst combining the expertise of a seasoned music producer, music critic, and A&R professional with 20+ years of industry experience.

Your role is to analyze uploaded music files and generate comprehensive, insightful written reports that feel like genuine expert human feedback — not a data dump.

Guidelines:
- Be specific and refer to actual musical elements you detect in the audio
- Use music industry language naturally (timbre, dynamics, arrangement, mix, mastering, etc.)
- Be encouraging but honest — praise genuine strengths and note real improvement areas
- Every score must be justified with clear, specific reasoning
- Write as if you're a knowledgeable friend in the music industry giving honest, expert advice
- The producerReview paragraph should be the most compelling piece — make it feel personal and insightful
- Use the full 1-10 range meaningfully — not everything should score 7/10
- For similar artists, pick well-known references that genuinely match the sound`;

export class MusicAnalysisService {
  static async create(data: {
    userId: string;
    fileName: string;
    fileSizeBytes?: number;
    fileUrl?: string;
  }) {
    const analysis = new MusicAnalysisModel({
      userId: data.userId,
      fileName: data.fileName,
      fileSizeBytes: data.fileSizeBytes,
      fileUrl: data.fileUrl,
      status: "pending",
      insights: null,
      isStarred: false,
    });
    await analysis.save();
    return analysis;
  }

  static async getById(id: string, userId: string) {
    return MusicAnalysisModel.findOne({ _id: id, userId }).lean();
  }

  static async listByUser(userId: string, limit = 20, skip = 0) {
    const [items, total] = await Promise.all([
      MusicAnalysisModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      MusicAnalysisModel.countDocuments({ userId }),
    ]);
    return { items, total };
  }

  static async toggleStar(id: string, userId: string) {
    const doc = await MusicAnalysisModel.findOne({ _id: id, userId });
    if (!doc) throw new Error("Analysis not found");
    doc.isStarred = !doc.isStarred;
    await doc.save();
    return doc.toObject();
  }

  static async deleteById(id: string, userId: string) {
    const result = await MusicAnalysisModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) throw new Error("Analysis not found");
    return { deleted: true };
  }

  static async updateStatus(
    id: string,
    status: "pending" | "processing" | "completed" | "failed",
    data?: { insights?: MusicInsightData; errorMessage?: string },
  ) {
    const update: Record<string, unknown> = { status };
    if (data?.insights) update.insights = data.insights;
    if (data?.errorMessage) update.errorMessage = data.errorMessage;
    return MusicAnalysisModel.findByIdAndUpdate(id, update, { new: true }).lean();
  }

  static async getGenreDistribution(userId: string) {
    const analyses = await MusicAnalysisModel.find({
      userId,
      status: "completed",
      "insights.genre": { $exists: true, $ne: null },
    })
      .select("insights.genre")
      .lean();

    const genreMap: Record<string, number> = {};
    for (const a of analyses) {
      if (a.insights?.genre) {
        const primaryGenre = a.insights.genre.split("/")[0].trim();
        genreMap[primaryGenre] = (genreMap[primaryGenre] ?? 0) + 1;
      }
    }

    return Object.entries(genreMap)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }
}
