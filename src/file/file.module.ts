import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { RoomModule } from 'src/room/room.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as appRoot from 'app-root-path';
@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    RoomModule,
    ServeStaticModule.forRoot({
      rootPath: `${appRoot.path}/upload`,
      serveRoot: '/upload',
    }),
  ],
})
export class FileModule {}
