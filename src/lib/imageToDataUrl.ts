// Attached images are embedded inline as data: URIs (there's no backend to
// upload to), which means they live in the same localStorage quota as
// everything else — typically 5-10MB per origin. A couple of full-resolution
// photos would eat that instantly, so every image is downscaled before
// it's ever inserted into a note.

const MAX_DIMENSION = 1400
const JPEG_QUALITY = 0.82

export class ImageTooLargeError extends Error {
  constructor() {
    super('Could not process this image — it may be corrupted or an unsupported format.')
    this.name = 'ImageTooLargeError'
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new ImageTooLargeError())
    img.src = src
  })
}

/** Read a File, downscale it if needed, and return a data: URL ready to embed. */
export async function fileToDataUrl(file: File): Promise<string> {
  const reader = new FileReader()
  const original = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new ImageTooLargeError())
    reader.readAsDataURL(file)
  })

  const img = await loadImage(original)
  if (img.width <= MAX_DIMENSION && img.height <= MAX_DIMENSION) {
    return original
  }

  const scale = MAX_DIMENSION / Math.max(img.width, img.height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return original

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  // PNG keeps transparency but compresses poorly for photos; re-encoding a
  // downscaled PNG as PNG still shrinks it a lot just from fewer pixels, so
  // only force JPEG for formats that were never going to have transparency.
  const outputType = file.type === 'image/png' || file.type === 'image/gif' ? 'image/png' : 'image/jpeg'
  return canvas.toDataURL(outputType, JPEG_QUALITY)
}
