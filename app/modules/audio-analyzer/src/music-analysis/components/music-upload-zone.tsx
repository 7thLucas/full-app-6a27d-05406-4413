import { useRef, useState, type DragEvent, type ChangeEvent } from "react";

const ACCEPTED_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/wave", "audio/x-wav",
  "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/aac", "audio/x-aac", "audio/ogg", "audio/flac"];
const ACCEPT_ATTR = "audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac";

interface MusicUploadZoneProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  label?: string;
  hint?: string;
}

function EqualizerBars() {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`w-1 rounded-full bg-gradient-to-t from-[#7C3AED] to-[#3B82F6] eq-bar-${n}`}
          style={{ minHeight: 6 }}
        />
      ))}
    </div>
  );
}

function MusicNoteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function MusicUploadZone({ onUpload, isLoading = false, label, hint }: MusicUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isDisabled = isLoading;

  const handleFile = (file: File) => {
    const mimeType = file.type?.toLowerCase() ?? "";
    const isAudio = ACCEPTED_TYPES.includes(mimeType) || mimeType.startsWith("audio/");
    if (!isAudio) {
      setValidationError("Please upload an audio file (MP3, WAV, M4A, AAC)");
      return;
    }
    const maxMb = 55;
    if (file.size > maxMb * 1024 * 1024) {
      setValidationError(`File is too large. Maximum size is ${maxMb}MB.`);
      return;
    }
    setValidationError(null);
    onUpload(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="w-full">
      {validationError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {validationError}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-disabled={isDisabled}
        className={[
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed",
          "px-8 py-16 cursor-pointer transition-all duration-300 outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F1A]",
          isDragging
            ? "border-[#7C3AED] bg-[#7C3AED]/10 scale-[1.01] upload-pulse"
            : "border-[#7C3AED]/30 bg-[#1A1A2E] hover:border-[#7C3AED]/60 hover:bg-[#7C3AED]/5",
          isDisabled ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
        onDragOver={(e) => { e.preventDefault(); if (!isDisabled) setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => !isDisabled && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
      >
        {/* Subtle glow background */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)" }}
        />

        <div className="relative flex flex-col items-center gap-4 text-center z-10">
          {isLoading ? (
            <>
              <EqualizerBars />
              <div>
                <p className="text-lg font-semibold text-white">Analyzing your track…</p>
                <p className="mt-1 text-sm text-[#94A3B8]">This may take a minute. AI magic in progress.</p>
              </div>
            </>
          ) : isDragging ? (
            <>
              <div className="text-[#7C3AED]"><MusicNoteIcon /></div>
              <p className="text-lg font-semibold text-white">Drop it here</p>
            </>
          ) : (
            <>
              <div className="text-[#7C3AED]/60"><MusicNoteIcon /></div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {label ?? "Drop your track here"}
                </p>
                <p className="mt-1.5 text-sm text-[#94A3B8]">
                  {hint ?? "or click to browse"}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {["MP3", "WAV", "M4A", "AAC"].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border"
                    style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.3)", color: "#a78bfa" }}
                  >
                    {fmt}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#94A3B8]/70">Up to 50MB</p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          disabled={isDisabled}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
