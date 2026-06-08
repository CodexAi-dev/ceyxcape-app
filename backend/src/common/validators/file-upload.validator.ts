import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import * as crypto from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Used as multer fileFilter — rejects non-image files before they hit disk.
export const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new BadRequestException('Only JPEG, PNG, and WebP images are allowed'), false);
  }
  cb(null, true);
};

// Generates a cryptographically random filename, preserving only the safe extension.
export const safeFilename = (_req: Request, file: Express.Multer.File, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const safeName = `${crypto.randomBytes(16).toString('hex')}${ext}`;
  cb(null, safeName);
};

export const multerLimits = { fileSize: MAX_FILE_SIZE };
