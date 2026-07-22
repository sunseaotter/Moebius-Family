"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_SIZE = 220;
const OUTPUT_SIZE = 480;
const MAX_ZOOM = 3;
const MAX_RAW_BYTES = 15 * 1024 * 1024;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function PhotoUploadField({ existingPhotoUrl }: { existingPhotoUrl?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);

  const baseScale = naturalSize
    ? Math.max(FRAME_SIZE / naturalSize.w, FRAME_SIZE / naturalSize.h)
    : 1;
  const displayScale = baseScale * zoom;
  const displayedW = naturalSize ? naturalSize.w * displayScale : 0;
  const displayedH = naturalSize ? naturalSize.h * displayScale : 0;
  const maxOffsetX = Math.max(0, (displayedW - FRAME_SIZE) / 2);
  const maxOffsetY = Math.max(0, (displayedH - FRAME_SIZE) / 2);

  // Re-render the crop to a fixed-size square and stash it in the hidden
  // file input whenever the image, zoom, or position changes.
  useEffect(() => {
    if (!imageSrc || !naturalSize) return;
    const id = setTimeout(() => {
      const img = imgRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx || !img) return;

      const srcW = FRAME_SIZE / displayScale;
      const srcH = FRAME_SIZE / displayScale;
      const srcX = naturalSize.w / 2 - srcW / 2 - pos.x / displayScale;
      const srcY = naturalSize.h / 2 - srcH / 2 - pos.y / displayScale;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      canvas.toBlob(
        (blob) => {
          if (!blob || !fileInputRef.current) return;
          const file = new File([blob], "profile-photo.jpg", { type: "image/jpeg" });
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInputRef.current.files = dt.files;
        },
        "image/jpeg",
        0.9
      );
    }, 80);
    return () => clearTimeout(id);
  }, [imageSrc, naturalSize, zoom, pos, displayScale]);

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_RAW_BYTES) {
      setError("That photo is too large — please choose a smaller file.");
      return;
    }
    setError(null);
    setNaturalSize(null);
    setZoom(1);
    setPos({ x: 0, y: 0 });
    setImageSrc(URL.createObjectURL(file));
  }

  function onImgLoad() {
    const img = imgRef.current;
    if (img) setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  }

  function onPointerDown(e: React.PointerEvent) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture can fail (e.g. synthetic events); dragging still
      // works via document-level listeners, just without capture.
    }
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: clamp(dragRef.current.origX + dx, -maxOffsetX, maxOffsetX),
      y: clamp(dragRef.current.origY + dy, -maxOffsetY, maxOffsetY),
    });
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  function onZoomChange(nextZoom: number) {
    setZoom(nextZoom);
    if (!naturalSize) return;
    const nextDisplayScale = baseScale * nextZoom;
    const nextW = naturalSize.w * nextDisplayScale;
    const nextH = naturalSize.h * nextDisplayScale;
    const nextMaxX = Math.max(0, (nextW - FRAME_SIZE) / 2);
    const nextMaxY = Math.max(0, (nextH - FRAME_SIZE) / 2);
    setPos((p) => ({ x: clamp(p.x, -nextMaxX, nextMaxX), y: clamp(p.y, -nextMaxY, nextMaxY) }));
  }

  function chooseDifferent() {
    setImageSrc(null);
    setNaturalSize(null);
    if (pickerInputRef.current) pickerInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <span className="block text-sm text-wood-700 mb-1">Profile Photo</span>

      {imageSrc ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-wood-200 bg-wood-50 p-4">
          <div
            className="relative touch-none select-none overflow-hidden rounded-full border border-wood-300"
            style={{ width: FRAME_SIZE, height: FRAME_SIZE, cursor: "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={onImgLoad}
              alt="Preview"
              draggable={false}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: displayedW || undefined,
                height: displayedH || undefined,
                maxWidth: "none",
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,
              }}
            />
          </div>
          <label className="flex w-full max-w-xs items-center gap-2 text-xs text-wood-600">
            Zoom
            <input
              type="range"
              min={1}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="flex-1"
            />
          </label>
          <p className="text-xs text-wood-500">Drag the photo to reposition it.</p>
          <button
            type="button"
            onClick={chooseDifferent}
            className="text-sm text-sage-700 underline hover:text-sage-800"
          >
            Choose a different photo
          </button>
        </div>
      ) : (
        <>
          {existingPhotoUrl && (
            <div className="mb-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={existingPhotoUrl}
                alt="Current profile photo"
                className="h-16 w-16 rounded-full border border-wood-200 object-cover"
              />
              <label className="flex items-center gap-2 text-sm text-wood-600">
                <input type="checkbox" name="removePhoto" className="rounded border-wood-300" />
                Remove current photo
              </label>
            </div>
          )}
          <input
            ref={pickerInputRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            className="block w-full text-sm text-wood-700 file:mr-3 file:rounded-full file:border-0 file:bg-sage-600 file:px-4 file:py-1.5 file:text-white hover:file:bg-sage-700"
          />
          <p className="mt-1 text-xs text-wood-500">JPG or PNG. You&apos;ll be able to preview and reposition it.</p>
        </>
      )}

      <input ref={fileInputRef} type="file" name="photo" className="hidden" aria-hidden />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
