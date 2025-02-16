import { Controller, Get, Delete, Put, Param, Body } from '@nestjs/common';
import { UserService } from './user.provider';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('user')
export class UserController {
  private userServcie: UserService;
  constructor(userProvider: UserService) {
    this.userServcie = userProvider;
  }
  @Get(':id')
  async get(@Param('id') userId: string) {
    return await this.userServcie.findById(userId);
  }
  @Put(':id')
  async update(@Param('id') userId: string, @Body() dto: UpdateUserDto) {
    return await this.userServcie.updateById(userId, dto);
  }
  @Delete(':id')
  async delete(@Param('id') userId: string) {
    return await this.userServcie.deleteById(userId);
  }
}
