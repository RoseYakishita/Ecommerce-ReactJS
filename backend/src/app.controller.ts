import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return this.appService.getHealth();
  }

  @Get('ready')
  ready() {
    return this.appService.getReadiness();
  }

  @Get('version')
  version() {
    return this.appService.getVersion();
  }
}
