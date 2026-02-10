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
 * Shows a full-screen modal with the image and download options
 */
function showImageModal(dataUrl: string, filename: string): void {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'image-download-modal';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 999999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow-y: auto;
    animation: fadeIn 0.3s ease;
  `;

  // Create container
  const container = document.createElement('div');
  container.style.cssText = `
    max-width: 600px;
    width: 100%;
    text-align: center;
  `;

  // Create image
  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = filename;
  img.style.cssText = `
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    margin-bottom: 20px;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: default;
  `;

  // Create instructions
  const instructions = document.createElement('div');
  instructions.style.cssText = `
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  const isMobile = isMobileDevice();
  instructions.innerHTML = isMobile ? `
    <strong style="color: #ffd700;">📱 Cách lưu ảnh trên điện thoại:</strong><br><br>
    <strong style="color: #ffd700;">Cách 1:</strong> Nhấn nút "Chia sẻ/Lưu ảnh" bên dưới<br>
    <strong style="color: #ffd700;">Cách 2:</strong> Nhấn giữ vào ảnh → chọn "Lưu ảnh"<br>
    <strong style="color: #ffd700;">Cách 3:</strong> Chụp màn hình (Screenshot) trang này<br>
    <strong style="color: #ffd700;">Cách 4:</strong> Nhấn "⋮" → "Mở bằng trình duyệt" → thử lại
  ` : `
    <strong style="color: #ffd700;">💾 Cách lưu ảnh:</strong><br><br>
    Nhấn chuột phải vào ảnh → chọn "Save image as..."<br>
    hoặc nhấn nút "Tải xuống" bên dưới
  `;

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  `;

  // Create share/download button
  const shareBtn = document.createElement('button');
  shareBtn.textContent = isMobile ? '📤 Chia sẻ / Lưu ảnh' : '💾 Tải xuống ảnh';
  shareBtn.style.cssText = `
    padding: 16px 32px;
    background: linear-gradient(135deg, #bc4749 0%, #a3393b 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(188, 71, 73, 0.4);
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  shareBtn.onclick = async () => {
    const blob = dataURLtoBlob(dataUrl);

    // Try share API first on mobile
    if (isMobile && navigator.share) {
      const shared = await tryShareImage(blob, filename);
      if (shared) {
        overlay.remove();
        return;
      }
    }

    // Fallback to download
    try {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Không thể tải xuống tự động. Vui lòng nhấn giữ vào ảnh và chọn "Lưu ảnh"');
    }
  };

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ Đóng';
  closeBtn.style.cssText = `
    padding: 16px 32px;
    background: rgba(255,255,255,0.1);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 12px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  closeBtn.onclick = () => {
    overlay.remove();
  };

  // Add hover effects
  shareBtn.onmouseenter = () => {
    shareBtn.style.transform = 'translateY(-2px)';
    shareBtn.style.boxShadow = '0 6px 20px rgba(188, 71, 73, 0.6)';
  };
  shareBtn.onmouseleave = () => {
    shareBtn.style.transform = 'translateY(0)';
    shareBtn.style.boxShadow = '0 4px 15px rgba(188, 71, 73, 0.4)';
  };

  closeBtn.onmouseenter = () => {
    closeBtn.style.background = 'rgba(255,255,255,0.2)';
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.background = 'rgba(255,255,255,0.1)';
  };

  // Assemble the modal
  buttonContainer.appendChild(shareBtn);
  buttonContainer.appendChild(closeBtn);
  container.appendChild(img);
  container.appendChild(instructions);
  container.appendChild(buttonContainer);
  overlay.appendChild(container);

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Add to document
  document.body.appendChild(overlay);

  // Close on overlay click (but not on content click)
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  };

  // Close on ESC key
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

/**
 * Downloads or shares an image based on the browser environment
 * Shows a modal instead of opening new window (works better in in-app browsers)
 */
export async function downloadOrOpenImage(dataUrl: string, filename: string): Promise<void> {
  const blob = dataURLtoBlob(dataUrl);
  const isMobile = isMobileDevice();

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

  // Strategy 3: Show modal (works in all browsers including in-app)
  showImageModal(dataUrl, filename);
}
