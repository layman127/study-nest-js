import {
  Controller,
  Get,
  Delete,
  Put,
  Param,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { UserProvider } from './user.provider';
import { USER_BY_ID_NOT_FOUND_ERROR_MSG } from './user.constants';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('user')
export class UserController {
  private userProvider: UserProvider;
  constructor(userProvider: UserProvider) {
    this.userProvider = userProvider;
  }
  @Get(':id')
  async get(@Param('id') userId: string) {
    const response = await this.userProvider.findById(userId);
    if (!response) {
      throw new NotFoundException(USER_BY_ID_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Put(':id')
  async update(@Param('id') userId: string, @Body() dto: UpdateUserDto) {
    const response = await this.userProvider.updateById(userId, dto);
    if (!response) {
      throw new NotFoundException(USER_BY_ID_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Delete(':id')
  async delete(@Param('id') userId: string) {
    const response = await this.userProvider.deleteById(userId);
    if (!response) {
      throw new NotFoundException(USER_BY_ID_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
}
