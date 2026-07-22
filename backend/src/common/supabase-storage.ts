import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { randomBytes } from 'crypto';
import { imageFileFilter, multerLimits } from './validators/file-upload.validator';

// Images are stored in a public Supabase Storage bucket. Uploaded files are
// kept in memory (serverless has no writable disk) then streamed to Storage,
// and we persist the returned public URL in the database.
const BUCKET = process.env.SUPABASE_BUCKET || 'media';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

let client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!client) {
    if (!SUPABASE_URL || !SERVICE_KEY) {
      throw new Error(
        'Supabase Storage not configured — set SUPABASE_URL and SUPABASE_SERVICE_KEY',
      );
    }
    client = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

// multer options: buffer the upload in memory rather than writing to disk.
export const memoryUpload = {
  storage: memoryStorage(),
  fileFilter: imageFileFilter,
  limits: multerLimits,
};

function uniqueName(original: string): string {
  const ext = (extname(original || '').toLowerCase() || '.jpg').replace(
    /[^.a-z0-9]/g,
    '',
  );
  return `${Date.now()}_${randomBytes(6).toString('hex')}${ext}`;
}

// Upload a buffered file to `<bucket>/<folder>/<random>.<ext>` and return its
// public URL.
export async function uploadImage(
  folder: 'tours' | 'gallery',
  file: Express.Multer.File,
): Promise<string> {
  const objectPath = `${folder}/${uniqueName(file.originalname)}`;
  const { error } = await getClient()
    .storage.from(BUCKET)
    .upload(objectPath, file.buffer, {
      contentType: file.mimetype || 'image/jpeg',
      upsert: false,
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return getClient().storage.from(BUCKET).getPublicUrl(objectPath).data
    .publicUrl;
}

// Best-effort delete. Ignores non-Storage URLs (legacy/static paths).
export async function deleteImage(publicUrl?: string | null): Promise<void> {
  if (!publicUrl) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return;
  const objectPath = publicUrl.slice(i + marker.length);
  try {
    await getClient().storage.from(BUCKET).remove([objectPath]);
  } catch {
    /* best effort — never throw on delete */
  }
}
