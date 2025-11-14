import { HealthRepository } from './health.repository';

export interface HealthStatus {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
}

export class HealthService {
  private healthRepository: HealthRepository;

  constructor() {
    this.healthRepository = new HealthRepository();
  }

  async check(): Promise<HealthStatus> {
    const isDatabaseConnected = await this.healthRepository.checkDatabaseConnection();
    const status: HealthStatus = {
      status: isDatabaseConnected ? 'ok' : 'error',
      database: isDatabaseConnected ? 'connected' : 'disconnected',
    };

    return status;
  }

  startPeriodicCheck(intervalMs: number = 10000): void {
    setInterval(async () => {
      const isConnected = await this.healthRepository.checkDatabaseConnection();
      if (!isConnected) {
        console.warn('Connection with database is down');
      }
    }, intervalMs);
  }
}

