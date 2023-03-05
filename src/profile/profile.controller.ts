import { UserUpdateDto } from './dto/dto.update-user';
import { Controller, Get, Render, ParseIntPipe, Post } from '@nestjs/common';
import { Param, Patch, Query, Req } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('edit/:id')
  @Render('profile/edit')
  async editProfile(
    @Param('id', ParseIntPipe) id: number,
    @Query('email') email: string,
  ) {
    return await this.profileService.editProfile(id, email);
  }

  @Post('edit/:id')
  // @Patch('edit/:id')
  @Render('profile/edit')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Query('email') email: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return await this.profileService.updateProfile(id, email, userUpdateDto);
  }

  @Get(':id')
  @Render('profile/index')
  async getProfile(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<Object> {
    return await this.profileService.getProfile(id, req);
  }
}
