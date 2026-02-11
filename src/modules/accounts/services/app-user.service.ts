import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAppUserDto } from '../dtos/create-app-user.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class AppUserService {
  constructor(private prisma: PrismaService) {}

  async getAppUserByUsername(username: string) {
    return await this.prisma.app_user.findFirst({
      where: { username, removed_at: null },
    });
  }

  async getAppUserByPartnerId(partnerId: string) {
    return await this.prisma.app_user.findFirst({
      where: { business_partner_id: partnerId, removed_at: null },
    });
  }

  async createAppUser(dto: CreateAppUserDto, userId?: string) {
    const appUserId = uuidv7();

    return await this.prisma.app_user.create({
      data: {
        id: appUserId,
        business_partner_id: dto.businessPartnerId,
        role_id: dto.roleId,
        status_id: dto.appUserStatusId,
        username: dto.username,
        password_hash: dto.passwordHash,
        ...(dto.profileData ? { profile_data: dto.profileData } : {}),
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async updateAppUser(
    id: string,
    dto: Partial<CreateAppUserDto>,
    userId?: string,
  ) {
    return await this.prisma.app_user.update({
      where: { id, removed_at: null },
      data: {
        business_partner_id: dto.businessPartnerId,
        role_id: dto.roleId,
        status_id: dto.appUserStatusId,
        username: dto.username,
        password_hash: dto.passwordHash,
        ...(dto.profileData ? { profile_data: dto.profileData } : {}),
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async removeAppUser(id: string, userId?: string) {
    return await this.prisma.app_user.update({
      where: { id, removed_at: null },
      data: {
        removed_at: new Date(),
        removed_by: userId,
      },
    });
  }
}
