import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import { UPLOAD_ROOT } from '../../common/constants/upload.constants';

export const createMulterConfig = (folder: string) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(UPLOAD_ROOT, folder);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, '_');
      const uniqueName = `${randomUUID()}-${safeName}`;
      cb(null, uniqueName);
    },
  }),
});
