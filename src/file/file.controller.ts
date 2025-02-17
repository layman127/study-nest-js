import {
  Controller,
  Post,
  HttpCode,
  UseGuards,
  UseInterceptors,
  Param,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadResponse } from './dto/file-upload.response';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  private fileServive: FileService;
  constructor(fileServive: FileService) {
    this.fileServive = fileServive;
  }
  @Post('room-photo/:roomId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, new RoleGuard(['admin']))
  @UseInterceptors(FilesInterceptor('files', 3))
  async addPhoto(
    @Param('roomId') roomId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<FileUploadResponse[]> {
    const response: FileUploadResponse[] = [];
    for (const file of files) {
      response.push(await this.fileServive.addOnePhotoToRoom(roomId, file));
    }
    return response;
  }
}
