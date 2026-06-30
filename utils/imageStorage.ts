import * as FileSystem from 'expo-file-system/legacy';

const DIR = `${FileSystem.documentDirectory}pet-avatars/`;

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  }
}

export async function saveAvatar(sourceUri: string, name: string): Promise<string> {
  await ensureDir();
  const rawExt = sourceUri.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'jpg';
  const ext = ['jpg', 'jpeg', 'png', 'webp'].includes(rawExt) ? rawExt : 'jpg';
  const dest = `${DIR}${name}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}

export async function deleteAvatar(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch { /* ignore */ }
}
