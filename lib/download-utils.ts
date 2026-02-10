/**
 * Utility functions for downloading/sharing images on mobile devices,
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
 * Tries to share the image using Web Share API (works on mobile)
 */
async function tryShareImage(blob: Blob, filename: string): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    const file = new File([blob], filename, { type: blob.type });

    // Check if sharing files is supported
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      return false;
    }

    await navigator.share({
      files: [file],
      title: 'Tết 2026',
      text: 'Ảnh Tết Bính Ngọ 2026',
    });

    return true;
  } catch (error) {
    // User cancelled or share failed
    console.log('Share cancelled or failed:', error);
    return false;
  }
}

/**
 * Downloads or shares an image based on the browser environment
 */
export async function downloadOrOpenImage(dataUrl: string, filename: string): Promise<void> {
  const blob = dataURLtoBlob(dataUrl);
  const isMobile = isMobileDevice();
  const isInApp = isInAppBrowser();

  // Strategy 1: Try Web Share API on mobile (works best on mobile browsers)
  if (isMobile && navigator.share) {
    const shared = await tryShareImage(blob, filename);
    if (shared) {
      return; // Successfully shared
    }
  }

  // Strategy 2: Try blob download
  try {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);

    return; // Successfully downloaded
  } catch (error) {
    console.error('Blob download failed:', error);
  }

  // Strategy 3: Fallback - Open image in new window for manual save
  openImageInNewWindow(dataUrl, filename, isInApp || isMobile);
}

/**
 * Opens the image in a new window with instructions
 */
function openImageInNewWindow(dataUrl: string, filename: string, showMobileInstructions: boolean): void {
  const newWindow = window.open('', '_blank');
  if (!newWindow) {
    alert('Vui lòng cho phép popup để lưu ảnh, hoặc chụp màn hình trang này.');
    return;
  }

  const instructions = showMobileInstructions
    ? `
      <div class="instructions">
        <strong>📱 Cách lưu ảnh trên điện thoại:</strong><br><br>
        <strong>Cách 1:</strong> Nhấn vào nút "Tải xuống" bên dưới<br>
        <strong>Cách 2:</strong> Nhấn giữ vào ảnh → chọn "Lưu ảnh"<br>
        <strong>Cách 3:</strong> Chụp màn hình (Screenshot)<br>
        <strong>Cách 4:</strong> Nhấn nút ⋮ (menu) → "Mở bằng trình duyệt" → thử lại
      </div>
    `
    : `
      <div class="instructions">
        <strong>💾 Cách lưu ảnh:</strong><br><br>
        Nhấn chuột phải vào ảnh → chọn "Save image as..."<br>
        hoặc nhấn nút "Tải xuống" bên dưới
      </div>
    `;

  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>${filename}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            min-height: 100vh;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            overflow-x: hidden;
          }
          .container {
            width: 100%;
            max-width: 600px;
            text-align: center;
          }
          .image-wrapper {
            position: relative;
            margin: 20px 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            background: #fff;
          }
          img {
            width: 100%;
            height: auto;
            display: block;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: default;
          }
          .instructions {
            color: #fff;
            margin: 20px 0;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.8;
            text-align: left;
            border: 1px solid rgba(255,255,255,0.2);
          }
          .instructions strong {
            color: #ffd700;
          }
          .button-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 20px;
          }
          .download-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 32px;
            background: linear-gradient(135deg, #bc4749 0%, #a3393b 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(188, 71, 73, 0.4);
          }
          .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(188, 71, 73, 0.6);
          }
          .download-btn:active {
            transform: translateY(0);
          }
          .secondary-btn {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.3);
          }
          .secondary-btn:hover {
            background: rgba(255,255,255,0.2);
            box-shadow: 0 4px 15px rgba(255,255,255,0.2);
          }
          @media (max-width: 480px) {
            body {
              padding: 10px;
            }
            .instructions {
              font-size: 13px;
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="image-wrapper">
            <img src="${dataUrl}" alt="${filename}" id="mainImage" />
          </div>
          
          ${instructions}
          
          <div class="button-group">
            <a href="${dataUrl}" download="${filename}" class="download-btn" id="downloadBtn">
              💾 Tải xuống ảnh
            </a>
            <button onclick="window.close()" class="download-btn secondary-btn">
              ✕ Đóng cửa sổ
            </button>
          </div>
        </div>

        <script>
          // Try to trigger download on button click
          document.getElementById('downloadBtn').addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a temporary link and click it
            const link = document.createElement('a');
            link.href = '${dataUrl}';
            link.download = '${filename}';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });

          // Prevent context menu on image for better UX
          document.getElementById('mainImage').addEventListener('contextmenu', function(e) {
            // Allow context menu (for save image option)
            return true;
          });
        </script>
      </body>
    </html>
  `);

  newWindow.document.close();
}
