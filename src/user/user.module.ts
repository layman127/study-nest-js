import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './user.model';
import { UserProvider } from './user.provider';

@Module({
  controllers: [UserController],
  providers: [UserProvider],
  exports: [UserProvider],
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
