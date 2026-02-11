import { PrismaService } from '@core/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}
}
