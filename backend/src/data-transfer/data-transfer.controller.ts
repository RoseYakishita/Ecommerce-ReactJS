import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { DataTransferService } from './data-transfer.service';

@ApiTags('data-transfer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('data-transfer')
export class DataTransferController {
  constructor(private readonly dataTransferService: DataTransferService) {}

  @Get('export')
  @ApiOperation({ summary: 'Export full database data for migration/backup (admin only)' })
  exportAll() {
    return this.dataTransferService.exportAll();
  }

  @Post('import')
  @ApiOperation({ summary: 'Import full database data from exported JSON (admin only)' })
  importAll(@Body() body: any) {
    return this.dataTransferService.importAll(body.data, Boolean(body.replaceExisting));
  }
}
