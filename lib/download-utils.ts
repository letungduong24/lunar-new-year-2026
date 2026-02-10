/**
 * Utility functions for downloading images on mobile devices,
 * especially in in-app browsers (Messenger, Instagram, Facebook, etc.)
 */

/**
 * Converts a base64 data URL to a Blob
 */
function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Detects if the user is using an in-app browser
 */
export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent || navigator.vendor;

  // Check for common in-app browser signatures
  const inAppBrowserPatterns = [
    'FBAN', // Facebook App
    'FBAV', // Facebook App
    'Instagram',
    'Messenger',
    'Line/',
    'Zalo',
    'TikTok',
    'Twitter',
    'LinkedIn',
    'WhatsApp',
  ];

  return inAppBrowserPatterns.some(pattern => ua.includes(pattern));
}

/**
 * Detects if the user is on a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Downloads an image using Blob URL approach
 * This works better in in-app browsers by creating a blob and object URL
 */
export function downloadOrOpenImage(dataUrl: string, filename: string): void {
  try {
    // Convert data URL to Blob
    const blob = dataURLtoBlob(dataUrl);

    // Create object URL from blob
    const blobUrl = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);

  } catch (error) {
    console.error('Blob download failed, trying fallback...', error);

    // Fallback: Try direct data URL download
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackError) {
      console.error('Fallback download also failed', fallbackError);

      // Last resort: Open in new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${filename}</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background: #1a1a1a;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                .container {
                  text-align: center;
                  padding: 20px;
                  max-width: 100%;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                .instructions {
                  color: #fff;
                  margin-top: 20px;
                  padding: 15px;
                  background: rgba(255,255,255,0.1);
                  border-radius: 8px;
                  font-size: 14px;
                  line-height: 1.6;
                }
                .instructions strong {
                  color: #ffd700;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="${dataUrl}" alt="${filename}" />
                <div class="instructions">
                  <strong>📱 Cách lưu ảnh:</strong><br>
                  Nhấn giữ vào ảnh và chọn "Lưu ảnh" / "Save Image"<br>
                  hoặc chụp màn hình (Screenshot)
                </div>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  }
}
