import { prisma } from '@/database/prisma.client';

export class HealthRepository {
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      await prisma.customer.findFirst({
        select: { id: true },
      });
      return true;
    } catch (error) {
      console.error('Error on checking database connection:', error);
      return false;
    }
  }
}

