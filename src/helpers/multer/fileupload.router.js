import { Router } from 'express';
import { upload } from './multer.js';
import { requireAuth } from '../../auth/passport.js';
import { singleFileUpload } from './fileupload.controller.js';

export const MulterRouter = Router();

MulterRouter.post(
  '/singleFile',
  upload.single('file'),
  requireAuth,
  singleFileUpload,
);
