"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, RotateCcw, CheckCircle2 } from "lucide-react";
import ProgressBar from "../../ui/ProgressBar";
import { useChunkedUpload } from "../../../hooks/useChunkedUpload";

// Splits large video/audio files into 5MB chunks, uploads them with
// per-chunk retry, and resumes automatically after a dropped connection
// (the in-progress uploadId is kept in localStorage, keyed by file identity).
// On success, onUploaded receives the AWS result — read .cdnUrl / .fullS3URL
// off it and drop that into the module's video/audio JSON, the same as the
// old single-shot <input type="file"> flow did via the backend's req.file path.
// onBusyChange reports whether a chunk upload is in flight, so the parent
// form can disable its own submit button — without it, the form has no way
// to know the file isn't ready yet and submitting mid-upload just produces
// a misleading "file is required" validation error.
export default function ChunkedFileUpload({
  fieldname,
  accept,
  label = "File",
  currentUrl = "",
  error,
  onUploaded,
  onBusyChange,
}) {
  const { upload, cancel, reset, progress, status, error: uploadError } = useChunkedUpload();
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);

  const isBusy = status === "uploading" || status === "completing";

  useEffect(() => {
    onBusyChange?.(isBusy);
  }, [isBusy, onBusyChange]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const uploaded = await upload(file, fieldname);
      onUploaded?.(uploaded);
    } catch {
      // status/error are already surfaced via hook state
    }
  };

  return (
    <div>
      <label className={lbl}>{label}</label>

      <div
        className={`rounded-xl border px-4 py-3 ${
          error ? "border-2 border-red-500" : "border-orange-300"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            disabled={isBusy}
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
          />

          {isBusy ? (
            <button
              type="button"
              onClick={cancel}
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
            >
              <X size={14} /> Cancel
            </button>
          ) : status === "error" || status === "cancelled" ? (
            <button
              type="button"
              onClick={() => {
                reset();
                inputRef.current?.click();
              }}
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              <RotateCcw size={14} /> Retry
            </button>
          ) : status === "done" ? (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 size={14} /> Uploaded
            </span>
          ) : null}
        </div>

        {status !== "idle" && (
          <div className="mt-3">
            <ProgressBar
              percentage={progress}
              label={status === "completing" ? "Finalizing…" : fileName}
              color={status === "error" ? "from-red-500 to-rose-500" : "from-orange-500 to-amber-600"}
            />
          </div>
        )}

        {status === "idle" && currentUrl && (
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <UploadCloud size={12} /> Current file will be kept unless you upload a new one.
          </p>
        )}

        {status === "error" && uploadError && (
          <p className="mt-2 text-xs font-medium text-red-600">{uploadError}</p>
        )}
      </div>
    </div>
  );
}

const lbl = "block mb-2 text-sm font-medium text-gray-700";
