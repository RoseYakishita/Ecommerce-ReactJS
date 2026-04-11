import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'ecommerce-backend',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness() {
    const dbReady = this.dataSource.isInitialized;
    if (dbReady) {
      await this.dataSource.query('SELECT 1');
    }

    return {
      status: dbReady ? 'ready' : 'not_ready',
      database: dbReady ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    };
  }

  getVersion() {
    const packagePath = join(process.cwd(), 'package.json');
    const pkg = existsSync(packagePath)
      ? JSON.parse(readFileSync(packagePath, 'utf8'))
      : { name: 'backend', version: 'unknown' };

    return {
      name: pkg.name,
      version: pkg.version,
      nodeEnv: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }
}
