import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAppUserBusinessUnitDto } from '../dtos/create-app-user-business-unit.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class AppUserBusinessUnitService {
  constructor(private prisma: PrismaService) {}

  async getAppUsers(businessUnitId: string) {
    return await this.prisma.app_user_business_unit.findMany({
      where: { business_unit_id: businessUnitId },
      include: { app_user: true },
      orderBy: { app_user: { username: 'asc' } },
    });
  }

  async getBusinessUnits(appUserId: string) {
    return await this.prisma.app_user_business_unit.findMany({
      where: { app_user_id: appUserId },
      include: { business_unit: true },
      orderBy: { business_unit: { code: 'asc' } },
    });
  }

  async getAppUserBusinessUnit(appUserId: string, businessUnitId: string) {
    return await this.prisma.app_user_business_unit.findFirst({
      where: { app_user_id: appUserId, business_unit_id: businessUnitId },
      include: { app_user: true, business_unit: true },
    });
  }

  async addAppUserToBusinessUnit(dto: CreateAppUserBusinessUnitDto) {
    const appUserBusinessUnitId = uuidv7();
    return await this.prisma.app_user_business_unit.create({
      data: {
        id: appUserBusinessUnitId,
        app_user_id: dto.appUserId,
        business_unit_id: dto.businessUnitId,
      },
    });
  }

  async removeAppUserFromBusinessUnit(
    appUserId: string,
    businessUnitId: string,
  ) {
    return await this.prisma.app_user_business_unit.deleteMany({
      where: { app_user_id: appUserId, business_unit_id: businessUnitId },
    });
  }
}
