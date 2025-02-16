import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import {
  USER_ALREADY_EXIST_ERROR_MSG,
  USER_BY_ID_NOT_FOUND_ERROR_MSG,
} from './user.constants';
import * as argon2 from 'argon2';
import { Document } from 'mongoose';
@Injectable()
export class UserService {
  userModel: Model<UserModel>;
  constructor(@InjectModel(UserModel.name) userModel: Model<UserModel>) {
    this.userModel = userModel;
  }
  async createUser(dto: CreateUserDto) {
    if (await this.findByEmal(dto.email)) {
      throw new BadRequestException(USER_ALREADY_EXIST_ERROR_MSG);
    }
    const newUser = new this.userModel({
      ...dto,
      hashedPassword: await argon2.hash(dto.password),
    });
    return this.getUserWithoutHashedPassword(await newUser.save());
  }
  async findByEmal(email: string) {
    return await this.userModel.findOne({ email });
  }
  async findById(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(USER_BY_ID_NOT_FOUND_ERROR_MSG);
    }
    return this.getUserWithoutHashedPassword(user);
  }
  async updateById(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, dto);
    if (!user) {
      throw new NotFoundException(USER_BY_ID_NOT_FOUND_ERROR_MSG);
    }
    return this.getUserWithoutHashedPassword(user);
  }
  async deleteById(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException(USER_BY_ID_NOT_FOUND_ERROR_MSG);
    }
    return this.getUserWithoutHashedPassword(user);
  }
  getUserWithoutHashedPassword(
    user: UserModel,
  ): Omit<Omit<UserModel, keyof Document>, 'hashedPassword'> {
    const userWithoutPassword = { ...user.toObject() } as Partial<UserModel>;
    delete userWithoutPassword.hashedPassword;
    return userWithoutPassword as Omit<
      Omit<UserModel, keyof Document>,
      'hashedPassword'
    >;
  }
}
