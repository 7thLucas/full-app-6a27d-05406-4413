import { Router } from "express";
import multer from "multer";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import {
  createAnalysis,
  getAnalysis,
  listAnalyses,
  toggleStarAnalysis,
  deleteAnalysis,
  getGenreDistribution,
} from "../music-analysis/controllers/music-analysis.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 60 * 1024 * 1024 } });

// All music analysis routes require auth
router.post("/api/music-analysis", requireAuth, upload.single("file"), createAnalysis);
router.get("/api/music-analysis", requireAuth, listAnalyses);
router.get("/api/music-analysis/genre-distribution", requireAuth, getGenreDistribution);
router.get("/api/music-analysis/:id", requireAuth, getAnalysis);
router.patch("/api/music-analysis/:id/star", requireAuth, toggleStarAnalysis);
router.delete("/api/music-analysis/:id", requireAuth, deleteAnalysis);

export default router;
