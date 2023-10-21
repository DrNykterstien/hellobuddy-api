import { Request } from 'express';
import multer from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const acceptedUploadFields = ['chat', 'test'];

const diskStorage = multer.diskStorage({
  destination: (_req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
    const dest = join(process.cwd(), 'public', 'uploads', file.fieldname);
    cb(null, dest);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, `${uuidv4()}${extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: diskStorage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb) => {
    if (acceptedUploadFields.includes(file.fieldname)) cb(null, true);
    else cb(null, false);
  },
  limits: { fileSize: 8 * 1024 ** 2 }
});

export default upload;
