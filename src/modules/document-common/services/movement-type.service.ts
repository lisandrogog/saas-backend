import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateMovementTypeDto } from '../dtos/create-movement-type.dto';

@Injectable()
export class MovementTypeService {
  constructor(private prisma: PrismaService) {}

  async getAllMovementTypes() {
    return await this.prisma.movement_type.findMany({
      orderBy: { sign: 'asc', code: 'asc' },
    });
  }

  async getMovementTypeByCode(code: string) {
    return await this.prisma.movement_type.findUnique({
      where: { code },
    });
  }

  async createMovementType(dto: CreateMovementTypeDto) {
    return await this.prisma.movement_type.create({
      data: {
        code: dto.code,
        name: dto.name,
        sign: dto.sign,
      },
    });
  }

  async updateMovementType(id: number, dto: Partial<CreateMovementTypeDto>) {
    return await this.prisma.movement_type.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        sign: dto.sign,
      },
    });
  }

  async upsertMovementType(partial: Partial<CreateMovementTypeDto>) {
    return await this.prisma.movement_type.upsert({
      where: { code: partial.code! },
      update: {
        name: partial.name,
        sign: partial.sign,
      },
      create: {
        code: partial.code!,
        name: partial.name!,
        sign: partial.sign!,
      },
    });
  }
}
