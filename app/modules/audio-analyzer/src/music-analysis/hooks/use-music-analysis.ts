import { useCallback, useState } from "react";
import type { MusicInsightData } from "../models/music-analysis.model";

export interface MusicAnalysisRecord {
  _id: string;
  userId: string;
  fileName: string;
  fileSizeBytes?: number;
  fileUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  insights?: MusicInsightData | null;
  isStarred: boolean;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MusicAnalysisListResult {
  items: MusicAnalysisRecord[];
  total: number;
}

async function apiCall<T>(
  path: string,
  options?: RequestInit,
): Promise<{ success: boolean; data?: T; message?: string }> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return response.json();
}

export function useCreateMusicAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (file: File): Promise<MusicAnalysisRecord | null> => {
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/music-analysis", {
        method: "POST",
        body: form,
      });

      const result = await response.json() as { success: boolean; data?: MusicAnalysisRecord; message?: string };

      if (!result.success || !result.data) {
        throw new Error(result.message ?? "Analysis failed");
      }

      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
}

export function useMusicAnalysisList() {
  const [data, setData] = useState<MusicAnalysisListResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async (limit = 20, skip = 0) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiCall<MusicAnalysisListResult>(
        `/api/music-analysis?limit=${limit}&skip=${skip}`,
      );
      if (!res.success || !res.data) throw new Error(res.message ?? "Failed to load analyses");
      setData(res.data);
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch_ };
}

export function useMusicAnalysisDetail(id: string | null) {
  const [data, setData] = useState<MusicAnalysisRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    if (!id) return null;
    setLoading(true);
    setError(null);

    try {
      const res = await apiCall<MusicAnalysisRecord>(`/api/music-analysis/${id}`);
      if (!res.success || !res.data) throw new Error(res.message ?? "Not found");
      setData(res.data);
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { data, loading, error, refetch: fetch_ };
}

export function useToggleStar() {
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(async (id: string): Promise<boolean | null> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/music-analysis/${id}/star`, { method: "PATCH" });
      const json = await res.json() as { success: boolean; data?: { isStarred: boolean } };
      if (!json.success) return null;
      return json.data?.isStarred ?? null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggle, loading };
}

export function useDeleteAnalysis() {
  const [loading, setLoading] = useState(false);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/music-analysis/${id}`, { method: "DELETE" });
      const json = await res.json() as { success: boolean };
      return json.success;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading };
}

export function useGenreDistribution() {
  const [data, setData] = useState<Array<{ genre: string; count: number }>>([]);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiCall<Array<{ genre: string; count: number }>>("/api/music-analysis/genre-distribution");
      if (res.success && res.data) setData(res.data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, refetch: fetch_ };
}
