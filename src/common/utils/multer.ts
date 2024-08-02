import { HttpException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const multerProfileOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter(req, file, callback) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return callback(
        new HttpException(
          'Only jpg, jpeg, and png files are allowed for profile pictures',
          400,
        ),
        false,
      );
    }
    callback(null, true);
  },
};

export const multerMediaOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter(req, file, callback) {
    const type = req.query.type;
    if (type == 'posts') {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|mp4)$/)) {
        return callback(
          new HttpException(
            'Only jpg, jpeg, png and mp4 files are allowed for posts',
            400,
          ),
          false,
        );
      }
    } else if (type == 'reels') {
      if (!file.mimetype.match(/\/mp4$/)) {
        return callback(
          new HttpException('Only mp4 files are allowed for posts', 400),
          false,
        );
      }
    } else {
      return callback(
        new HttpException('Invalid type query parameter', 400),
        false,
      );
    }
    callback(null, true);
  },
};
