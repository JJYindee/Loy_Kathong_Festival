/**
 * Compresses an image data URL or File to ensure its size does not exceed maxSizeBytes (default 500KB).
 * @param {string|File|Blob} input - Data URL string or File/Blob object
 * @param {number} maxSizeBytes - Maximum allowed size in bytes (default 500 * 1024 = 512,000 bytes)
 * @returns {Promise<{ dataUrl: string, sizeKB: number }>}
 */
export async function compressImageToMax500KB(input, maxSizeBytes = 500 * 1024) {
  return new Promise((resolve, reject) => {
    // If SVG or small text data URL, check size directly
    if (typeof input === 'string' && input.startsWith('data:image/svg+xml')) {
      const sizeBytes = (input.length * 3) / 4;
      return resolve({
        dataUrl: input,
        sizeKB: Math.round(sizeBytes / 1024)
      });
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Restrict max dimension to 800px to keep aspect ratio and optimize memory
      const maxDim = 800;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Draw with white background to avoid transparent black JPG artifacts
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Iteratively reduce quality if needed to ensure strictly <= 500KB
      let quality = 0.85;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      let sizeBytes = Math.round((dataUrl.length * 3) / 4);

      while (sizeBytes > maxSizeBytes && quality > 0.2) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        sizeBytes = Math.round((dataUrl.length * 3) / 4);
      }

      // If still exceeding 500KB (rare edge case), reduce dimensions
      if (sizeBytes > maxSizeBytes) {
        canvas.width = Math.round(width * 0.7);
        canvas.height = Math.round(height * 0.7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        sizeBytes = Math.round((dataUrl.length * 3) / 4);
      }

      resolve({
        dataUrl,
        sizeKB: Math.round(sizeBytes / 1024)
      });
    };

    img.onerror = (err) => {
      reject(new Error('Failed to load image for compression'));
    };

    if (typeof input === 'string') {
      img.src = input;
    } else if (input instanceof Blob || input instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(input);
    } else {
      reject(new Error('Invalid image input'));
    }
  });
}
