/**
 * Profile photo storage. The backend User model has no avatar field, so this
 * is a device-local preference (data URL in localStorage), not synced to the
 * server or other devices.
 */

const STORAGE_PREFIX = 'medix_avatar_';
const MAX_DIMENSION = 256;
const MAX_BYTES = 2 * 1024 * 1024;

function keyFor(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

export function getLocalAvatar(userId: string): string | null {
  return localStorage.getItem(keyFor(userId));
}

export function clearLocalAvatar(userId: string): void {
  localStorage.removeItem(keyFor(userId));
}

async function resizeToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported');
  ctx.drawImage(bitmap, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.85);
}

export async function setLocalAvatar(userId: string, file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be smaller than 2MB');
  }
  const dataUrl = await resizeToDataUrl(file);
  localStorage.setItem(keyFor(userId), dataUrl);
  return dataUrl;
}
