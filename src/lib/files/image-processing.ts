import sharp from "sharp";

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export function isImageMimeType(mimeType: string): boolean {
  return IMAGE_MIME_TYPES.has(mimeType);
}

export type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  mimeType: "image/webp";
};

export async function processImage(
  inputBuffer: Buffer,
  maxDimension: number,
): Promise<ProcessedImage> {
  const result = await sharp(inputBuffer, { failOn: "error" })
    .rotate()
    .resize(maxDimension, maxDimension, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
    mimeType: "image/webp",
  };
}
