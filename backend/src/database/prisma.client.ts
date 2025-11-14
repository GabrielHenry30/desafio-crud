import { spawn } from 'child_process';
import * as path from 'path';

interface PrismaClientWithMigrations {
  runMigrations(): Promise<void>;
  initDatabase(): Promise<void>;
  [key: string]: any;
}

let prismaInstance: PrismaClientWithMigrations | null = null;

function getPrisma(): PrismaClientWithMigrations {
  if (prismaInstance) {
    return prismaInstance;
  }

  const { PrismaClient } = require('@prisma/client');

  const prismaBase = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  prismaBase.$use(async (params: any, next: any) => {
    if (params.model === 'Customer' && ['create', 'update', 'updateMany', 'upsert'].includes(params.action)) {
      if (params.args?.data) {
        if (typeof params.args.data === 'object' && params.args.data.document) {
          params.args.data.document = params.args.data.document.toString().replace(/\D/g, '');
        }
      }

      if (params.action === 'upsert' && params.args?.update?.document) {
        params.args.update.document = params.args.update.document.toString().replace(/\D/g, '');
      }

      if (params.action === 'updateMany') {
        if (params.args?.data?.document) {
          params.args.data.document = params.args.data.document.toString().replace(/\D/g, '');
        }
      }
    }

    return next(params);
  });

  const prismaExtended = prismaBase.$extends({
    model: {
      customer: {
        async findMany(args?: any) {
          const { withDeleted, ...restArgs } = args || {};
          
          if (!withDeleted) {
            return prismaBase.customer.findMany({
              ...restArgs,
              where: {
                ...restArgs?.where,
                deletedAt: null,
              },
            });
          }
          
          return prismaBase.customer.findMany(args);
        },
        async findFirst(args?: any) {
          const { withDeleted, ...restArgs } = args || {};
          
          if (!withDeleted) {
            return prismaBase.customer.findFirst({
              ...restArgs,
              where: {
                ...restArgs?.where,
                deletedAt: null,
              },
            });
          }
          
          return prismaBase.customer.findFirst(args);
        },
        async findUnique(args: any) {
          const result = await prismaBase.customer.findUnique(args);
          
          if (result && result.deletedAt !== null) {
            return null;
          }
          
          return result;
        },
        async count(args?: any) {
          const { withDeleted, ...restArgs } = args || {};
          
          if (!withDeleted) {
            return prismaBase.customer.count({
              ...restArgs,
              where: {
                ...restArgs?.where,
                deletedAt: null,
              },
            });
          }
          
          return prismaBase.customer.count(args);
        },
      },
    },
  }) as PrismaClientWithMigrations;

  prismaExtended.runMigrations = async function (): Promise<void> {
    return new Promise((resolve, reject) => {
      const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');

      console.log('Applying database migrations...');

      const migrateProcess = spawn('npx', [
        'prisma',
        'migrate',
        'deploy',
        '--schema',
        schemaPath,
      ], {
        stdio: 'inherit',
        shell: true,
        cwd: path.join(__dirname, '../..'),
      });

      migrateProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Migrations applied successfully');
          resolve();
        } else {
          console.error(`Migration process exited with code ${code}`);
          reject(new Error(`Migration failed with code ${code}`));
        }
      });

      migrateProcess.on('error', (error) => {
        console.error('Error running migrations:', error);
        reject(error);
      });
    });
  };

  prismaExtended.initDatabase = async function (): Promise<void> {
    await prismaBase.$connect();
    console.log('Database connection established');

    await this.runMigrations();
  };

  prismaInstance = prismaExtended;
  return prismaInstance;
}

export const prisma = new Proxy({} as PrismaClientWithMigrations, {
  get(_target, prop) {
    return getPrisma()[prop as string];
  }
});
