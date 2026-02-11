import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly SALT_ROUNDS = 10;

  async hashData(data: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      return await bcrypt.hash(data, salt);
    } catch (error) {
      console.debug('Error al generar el hash:', error);
      throw new InternalServerErrorException('Error al generar el hash');
    }
  }

  async compareData(data: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(data, hash);
    } catch (error) {
      console.debug('Error al comparar el hash:', error);
      throw new InternalServerErrorException('Error al comparar el hash');
    }
  }
}
