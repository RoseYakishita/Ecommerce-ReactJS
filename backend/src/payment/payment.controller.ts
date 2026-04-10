import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('momo/create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create MoMo payment URL from current user cart (order is created after successful callback)' })
  async createMomoPayment(@CurrentUser() user: any) {
    return this.paymentService.createMomoPayment(user.userId);
  }

  @Get('momo/callback')
  @ApiOperation({ summary: 'Verify MoMo return query from frontend redirect' })
  async handleMomoCallbackGet(@Query() query: any) {
    return this.paymentService.handleMomoCallback(query);
  }

  @Post('momo/webhook')
  @ApiOperation({ summary: 'MoMo server-to-server IPN webhook' })
  async handleMomoWebhook(@Body() body: any) {
    return this.paymentService.handleMomoCallback(body);
  }
}
