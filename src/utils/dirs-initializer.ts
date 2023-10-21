import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { acceptedUploadFields } from '../middlewares/multer.middleware';

export function initializeUploadDirectories() {
  const baseDirectory = join('public', 'uploads');
  if (!existsSync(baseDirectory)) mkdirSync(baseDirectory, { recursive: true });
  acceptedUploadFields.forEach(f => mkdirSync(join(baseDirectory, f), { recursive: true }));
}
