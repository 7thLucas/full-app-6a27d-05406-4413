import { createHash } from "node:crypto";
import type { Request, Response } from "express";
import axios, { type AxiosError } from "axios";
import { MusicAnalysisService, MUSIC_INSIGHT_SCHEMA, MUSIC_SYSTEM_PROMPT } from "../services/music-analysis.service";
import type { MusicInsightData } from "../models/music-analysis.model";

const AGENTIC_SERVICE_URL = "https://api-micro-agentic.quantumbyte.ai";
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  "audio/x-aac",
  "audio/ogg",
  "audio/flac",
  "audio/x-flac",
];

function keyspace() {
  return process.env._KEYSPACE ?? "";
}

function authHeaders(): Record<string, string> {
  const auth = process.env.QB_SCAFFOLDER_KEY;
  return auth ? { Authentication: auth } : {};
}

function llmDedupeKey(ks: string, message: string, schema: string, systemPrompt: string, file: Express.Multer.File): string {
  const h = createHash("sha256");
  h.update(ks);
  h.update("\x00");
  h.update(message);
  h.update("\x00");
  h.update(schema);
  h.update("\x00");
  h.update(systemPrompt);
  h.update("\x00");
  h.update(file.originalname ?? "");
  h.update("\x00");
  h.update(createHash("sha256").update(file.buffer).digest("hex"));
  return h.digest("hex").slice(0, 32);
}

export async function createAnalysis(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "No audio file provided" });
      return;
    }

    const mimeType = file.mimetype?.toLowerCase() ?? "";
    const isAudio = ALLOWED_AUDIO_TYPES.includes(mimeType) || mimeType.startsWith("audio/");
    if (!isAudio) {
      res.status(400).json({ success: false, message: "Please upload an audio file (MP3, WAV, M4A, AAC)" });
      return;
    }

    const maxSizeBytes = 60 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      res.status(400).json({ success: false, message: "File size exceeds the 50MB limit" });
      return;
    }

    // Create analysis record
    const analysis = await MusicAnalysisService.create({
      userId,
      fileName: file.originalname ?? "track.mp3",
      fileSizeBytes: file.size,
    });

    // Mark as processing
    await MusicAnalysisService.updateStatus(analysis.id as string, "processing");

    // Call agentic LLM with the audio file
    const ks = keyspace();
    const message = `Please analyze this music track (filename: ${file.originalname}) and provide comprehensive expert insights. Focus on musical elements you can detect from the audio.`;
    const schemaStr = JSON.stringify(MUSIC_INSIGHT_SCHEMA);
    const dedupeKey = llmDedupeKey(ks, message, schemaStr, MUSIC_SYSTEM_PROMPT, file);

    const form = new FormData();
    form.set("message", message);
    form.set("schema", schemaStr);
    form.set("system_prompt", MUSIC_SYSTEM_PROMPT);

    const blob = new Blob([file.buffer], { type: file.mimetype || "audio/mpeg" });
    form.append("files", blob, file.originalname || "track.mp3");

    let llmResponse: MusicInsightData | null = null;

    try {
      const response = await axios.post<{
        response: MusicInsightData;
        status: string;
        error?: string | null;
      }>(`${AGENTIC_SERVICE_URL}/api/llm`, form, {
        headers: {
          "x-id-keyspace": ks,
          "idempotency-key": dedupeKey,
          ...authHeaders(),
        },
        timeout: 120_000,
      });

      const data = response.data?.response ?? null;
      if (data && response.data?.status === "DONE") {
        llmResponse = data as MusicInsightData;
        await MusicAnalysisService.updateStatus(analysis.id as string, "completed", {
          insights: llmResponse,
        });
      } else {
        const errorMsg = response.data?.error ?? "LLM returned no response";
        await MusicAnalysisService.updateStatus(analysis.id as string, "failed", {
          errorMessage: errorMsg,
        });
      }
    } catch (llmError) {
      const ax = llmError as AxiosError<{ detail?: string; message?: string }>;
      const detail =
        ax.response?.data?.detail ?? ax.response?.data?.message ?? ax.message ?? "Analysis failed";
      await MusicAnalysisService.updateStatus(analysis.id as string, "failed", {
        errorMessage: detail,
      });
    }

    // Return updated record
    const updated = await MusicAnalysisService.getById(analysis.id as string, userId);
    res.status(201).json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis creation failed";
    res.status(500).json({ success: false, message });
  }
}

export async function getAnalysis(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const analysis = await MusicAnalysisService.getById(req.params.id, userId);
    if (!analysis) {
      res.status(404).json({ success: false, message: "Analysis not found" });
      return;
    }

    res.json({ success: true, data: analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get analysis";
    res.status(500).json({ success: false, message });
  }
}

export async function listAnalyses(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const skip = Math.max(Number(req.query.skip) || 0, 0);

    const result = await MusicAnalysisService.listByUser(userId, limit, skip);
    res.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list analyses";
    res.status(500).json({ success: false, message });
  }
}

export async function toggleStarAnalysis(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const updated = await MusicAnalysisService.toggleStar(req.params.id, userId);
    res.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update analysis";
    res.status(error instanceof Error && error.message === "Analysis not found" ? 404 : 500).json({
      success: false,
      message,
    });
  }
}

export async function deleteAnalysis(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    await MusicAnalysisService.deleteById(req.params.id, userId);
    res.json({ success: true, message: "Analysis deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete analysis";
    res.status(error instanceof Error && error.message === "Analysis not found" ? 404 : 500).json({
      success: false,
      message,
    });
  }
}

export async function getGenreDistribution(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Authentication required" });
      return;
    }

    const data = await MusicAnalysisService.getGenreDistribution(userId);
    res.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get genre distribution";
    res.status(500).json({ success: false, message });
  }
}
