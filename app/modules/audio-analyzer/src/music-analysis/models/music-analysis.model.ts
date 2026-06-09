import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

export interface MusicInsightData {
  producerReview: string;
  mood: string;
  moodDescription: string;
  genre: string;
  genreDescription: string;
  tempo: string;
  tempoDescription: string;
  energy: number;
  energyDescription: string;
  danceability: number;
  danceabilityDescription: string;
  commercialAppeal: number;
  commercialAppealDescription: string;
  productionQuality: number;
  productionQualityDescription: string;
  instrumentation: string[];
  instrumentationDescription: string;
  vocals: string;
  vocalsDescription: string;
  songStructure: string;
  songStructureDescription: string;
  focusSuitability: number;
  focusSuitabilityDescription: string;
  workoutSuitability: number;
  workoutSuitabilityDescription: string;
  similarArtists: string[];
  audienceProfile: string;
  strengths: string[];
  improvements: string[];
}

@modelOptions({
  schemaOptions: {
    collection: "tbl_music_analyses",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class MusicAnalysis extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  userId!: string;

  @prop({ type: String, required: true })
  fileName!: string;

  @prop({ type: Number, required: false })
  fileSizeBytes?: number;

  @prop({ type: String, required: false })
  fileUrl?: string;

  @prop({
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  })
  status!: string;

  @prop({ type: Object, required: false, default: null })
  insights?: MusicInsightData | null;

  @prop({ type: Boolean, default: false })
  isStarred!: boolean;

  @prop({ type: String, required: false })
  errorMessage?: string;
}

export const MusicAnalysisModel = getModelForClass(MusicAnalysis);
