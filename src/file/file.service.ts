import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { FileUploadResponse } from './dto/file-upload.response';
import { ensureDir, writeFile } from 'fs-extra';
import { RoomService } from 'src/room/room.provider';
import * as sharp from 'sharp';
import * as appRootPath from 'app-root-path';

@Injectable()
export class FileService {
  private roomService: RoomService;

  constructor(roomService: RoomService) {
    this.roomService = roomService;
  }

  async addOnePhotoToRoom(
    roomId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResponse> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const folderPath = `${appRootPath.path}/upload/${dateFolder}`;
    await ensureDir(folderPath);
    const fileName = file.originalname;
    const optimizedFileName = fileName.replace(/\.[^/.]+$/, '-optimized$&');
    const originalPath = await this.saveOriginalFile(
      file,
      folderPath,
      dateFolder,
      roomId,
    );
    const optimizedPath = await this.saveOptimizedFile(
      file,
      folderPath,
      dateFolder,
      optimizedFileName,
      roomId,
    );
    return {
      url: [originalPath, optimizedPath],
      fileName,
    };
  }

  private async saveOriginalFile(
    file: Express.Multer.File,
    folderPath: string,
    dateFolder: string,
    roomId: string,
  ): Promise<string> {
    const filePath = `${folderPath}/${file.originalname}`;
    await writeFile(filePath, file.buffer);
    await this.roomService.addPhotoUrlToRoom(
      `${dateFolder}/${file.originalname}`,
      roomId,
    );
    return `${dateFolder}/${file.originalname}`;
  }

  private async saveOptimizedFile(
    file: Express.Multer.File,
    folderPath: string,
    dateFolder: string,
    optimizedFileName: string,
    roomId: string,
  ): Promise<string> {
    const optimizedFile = await sharp(file.buffer)
      .resize({ width: 500 })
      .toBuffer();
    const optimizedFilePath = `${folderPath}/${optimizedFileName}`;
    await writeFile(optimizedFilePath, optimizedFile);
    await this.roomService.addPhotoUrlToRoom(
      `${dateFolder}/${optimizedFileName}`,
      roomId,
    );
    return `${dateFolder}/${optimizedFileName}`;
  }
}
