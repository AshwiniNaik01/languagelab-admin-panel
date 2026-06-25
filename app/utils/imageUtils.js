/**
 * Compress and resize an image File using canvas.
 * @param {File} file
 * @param {{ maxDim?: number, quality?: number, format?: string }} options
 * @returns {Promise<string>} compressed data-URL
 */
export function compressImage(file, { maxDim = 400, quality = 0.8, format = "image/webp" } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image for compression."));
      img.src = e.target.result;

      img.onload = () => {
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL(format, quality));
      };
    };
  });
}

/**
 * Convert a base64 data-URL to a Blob for multipart/form-data upload.
 * @param {string} dataUrl
 * @returns {Blob}
 */
export function base64ToBlob(dataUrl) {
  const [header, body] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(body);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
