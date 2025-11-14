import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { useExpressServer } from 'routing-controllers';
import { prisma } from '@/database/prisma.client';
import { CustomerController } from '@/modules/customer/customer.controller';
import { HealthController } from '@/modules/health/health.controller';
import { HealthService } from '@/modules/health/health.service';
import { ValidationErrorHandler } from '@/common/validation.error.handler';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());
useExpressServer(app, {
  controllers: [CustomerController, HealthController],
  middlewares: [ValidationErrorHandler],
  defaultErrorHandler: false,
  validation: true,
  classTransformer: true,
});

async function startServer() {
  try {
    await prisma.initDatabase();

    const healthService = new HealthService();
    healthService.startPeriodicCheck(10000);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
