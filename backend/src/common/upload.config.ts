import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import {
  imageFileFilter,
  safeFilename,
  multerLimits,
} from './validators/file-upload.validator';

// Uploaded images are written into the Next.js frontend's /public folder so
// they are served directly at /uploads/tours/<file> and /images/gallery/<file>
// — matching the paths the frontend already uses. Both apps live on the same
// machine (XAMPP), so the backend writes straight into the frontend public dir.
const FRONTEND_PUBLIC =
  process.env.FRONTEND_PUBLIC_DIR ||
  path.resolve(process.cwd(), '..', 'frontend', 'public');

export const TOURS_UPLOAD_DIR =
  process.env.UPLOAD_TOURS_DIR || path.join(FRONTEND_PUBLIC, 'uploads', 'tours');

export const GALLERY_UPLOAD_DIR =
  process.env.UPLOAD_GALLERY_DIR ||
  path.join(FRONTEND_PUBLIC, 'images', 'gallery');

function ensureDir(dir: string) {
  // Never throw: on a read-only/serverless filesystem (e.g. Vercel) mkdir
  // fails, and this runs at import time via the controller decorators — an
  // uncaught error there would crash the whole app on cold start.
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    /* read-only FS — disk uploads handled by the Supabase Storage path */
  }
}

// Build multer options that store images in `dir` with a safe random filename.
export const imageUploadOptions = (dir: string) => {
  ensureDir(dir);
  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        ensureDir(dir);
        cb(null, dir);
      },
      filename: safeFilename,
    }),
    fileFilter: imageFileFilter,
    limits: multerLimits,
  };
};

// Best-effort delete of an uploaded file (never throws).
export const deleteUploadedFile = (dir: string, filename: string) => {
  if (!filename) return;
  // strip any path components to prevent traversal
  const safe = path.basename(filename);
  const full = path.join(dir, safe);
  fs.promises.unlink(full).catch(() => undefined);
};
