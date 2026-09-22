/**
 * Client-side Canvas Image Compressor & Resizer
 * Converts any device image (camera, phone, desktop - regardless of MB size)
 * into a crisp, lightweight Base64 JPEG (~15KB - 30KB) that safely fits into
 * browser storage without QuotaExceededError and renders immediately.
 */
export const compressImage = (
  file: File,
  maxWidth = 320,
  maxHeight = 320,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => {
        console.warn('Image load error for compression, falling back to raw:', err);
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (err) => reject(err);
  });
};
