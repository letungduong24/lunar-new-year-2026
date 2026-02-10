/**
 * Utility functions for downloading images on mobile devices,
 * especially in in-app browsers (Messenger, Instagram, Facebook, etc.)
 */

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
 * Downloads or opens an image based on the browser environment
 * For in-app browsers on mobile: opens in new tab for long-press save
 * For regular browsers: triggers download
 */
export function downloadOrOpenImage(dataUrl: string, filename: string): void {
    const isInApp = isInAppBrowser();
    const isMobile = isMobileDevice();

    if (isInApp || isMobile) {
        // For in-app browsers and mobile: open in new window
        // User can long-press to save the image
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
              .download-btn {
                display: inline-block;
                margin-top: 15px;
                padding: 12px 24px;
                background: #bc4749;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                transition: background 0.3s;
              }
              .download-btn:hover {
                background: #a3393b;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="${dataUrl}" alt="${filename}" />
              <div class="instructions">
                <strong>📱 Cách lưu ảnh:</strong><br>
                Nhấn giữ vào ảnh và chọn "Lưu ảnh" / "Save Image"
              </div>
              <a href="${dataUrl}" download="${filename}" class="download-btn">
                💾 Tải xuống
              </a>
            </div>
          </body>
        </html>
      `);
            newWindow.document.close();
        }
    } else {
        // For desktop browsers: trigger download
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }
}
