export const MAX_PHOTO_BYTES = 1024 * 1024; // 1MB

export type PhotoUpload = { buffer: Uint8Array<ArrayBuffer>; mimeType: string };

export type PhotoExtractResult =
  | { photo: PhotoUpload; error?: undefined }
  | { photo: null; error?: string };

/** Reads an optional image file from FormData, validating type and the 1MB size limit. */
export async function extractPhoto(
  formData: FormData,
  field = "photo"
): Promise<PhotoExtractResult> {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) {
    return { photo: null };
  }
  if (!file.type.startsWith("image/")) {
    return { photo: null, error: "Profile photo must be an image file" };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { photo: null, error: "Profile photo must be 1MB or smaller" };
  }
  const buffer = new Uint8Array(await file.arrayBuffer());
  return { photo: { buffer, mimeType: file.type } };
}
