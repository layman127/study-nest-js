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
    const fileName = file.originalname;
    const folderPath = `${appRootPath.path}/upload/${dateFolder}`;
    const filePath = `${folderPath}/${fileName}`;
    await ensureDir(folderPath);
    await writeFile(filePath, file.buffer);
    await this.roomService.addPhotoUrlToRoom(
      `${dateFolder}/${fileName}`,
      roomId,
    );
    const optimizedFile = await sharp(file.buffer)
      .resize({ width: 500 })
      .toBuffer();
    const optimizedFileName = fileName.replace(/\.[^/.]+$/, '-optimized$&');
    const optimizedFilePath = `${folderPath}/${optimizedFileName}`;
    await writeFile(optimizedFilePath, optimizedFile);
    await this.roomService.addPhotoUrlToRoom(
      `${dateFolder}/${optimizedFileName}`,
      roomId,
    );
    return {
      url: [`${dateFolder}/${fileName}`, `${dateFolder}/${optimizedFileName}`],
      fileName,
    };
  }
}
