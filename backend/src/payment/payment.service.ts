import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
  ) {}

  private normalizeBaseUrl(raw: string | undefined, fallback: string): string {
    const url = (raw || '').trim();
    if (!url) return fallback;
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  private getRequiredConfig(key: string): string {
    const value = (this.configService.get<string>(key) || '').trim();
    if (!value) {
      throw new BadRequestException(`${key} is missing`);
    }
    return value;
  }

  async createMomoPayment(orderId: number) {
    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new BadRequestException('Order not found');

    const partnerCode = this.getRequiredConfig('MOMO_PARTNER_CODE');
    const accessKey = this.getRequiredConfig('MOMO_ACCESS_KEY');
    const secretKey = this.getRequiredConfig('MOMO_SECRET_KEY');
    const endpoint = this.getRequiredConfig('MOMO_API_URL');

    const frontendBaseUrl = this.normalizeBaseUrl(
      this.configService.get<string>('FRONTEND_URL'),
      'http://localhost',
    );
    const backendPublicBaseUrl = this.normalizeBaseUrl(
      this.configService.get<string>('BACKEND_PUBLIC_URL'),
      `http://localhost:${this.configService.get<string>('PORT') || '3000'}`,
    );

    const redirectUrl = `${frontendBaseUrl}/payment-result`;
    const ipnUrl = `${backendPublicBaseUrl}/api/payment/momo/webhook`;
    const requestType = 'captureWallet';

    // Project stores order.totalAmount in USD currently -> convert to VND for MoMo.
    const exchangeRate = Number(this.configService.get<string>('MOMO_EXCHANGE_RATE') || 25000);
    const amount = String(Math.max(0, Math.round(Number(order.totalAmount) * exchangeRate)));

    const requestId = `${partnerCode}_${Date.now()}`;
    const momoOrderId = `${order.id}_${Date.now()}`;
    const orderInfo = `Thanh toan don hang #${order.id}`;
    const extraData = Buffer.from(JSON.stringify({ orderId: order.id }), 'utf8').toString('base64');

    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}` +
      `&orderId=${momoOrderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = {
      partnerCode,
      partnerName: 'Rose Furniture',
      storeId: 'RoseFurnitureStore',
      requestId,
      amount,
      orderId: momoOrderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: 'vi',
      requestType,
      autoCapture: true,
      extraData,
      signature,
    };

    this.logger.log(`[MoMo] Create payment for order #${order.id}, amount ${amount} VND`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok || Number(result.resultCode) !== 0 || !result.payUrl) {
      this.logger.error(`[MoMo] Create payment failed: ${JSON.stringify(result)}`);
      throw new BadRequestException(result?.message || 'Cannot create MoMo payment');
    }

    return result;
  }

  private decodeOrderIdFromCallback(orderIdRaw: string, extraDataRaw: string): number {
    if (extraDataRaw) {
      try {
        const decoded = Buffer.from(extraDataRaw, 'base64').toString('utf8');
        const parsed = JSON.parse(decoded);
        if (parsed?.orderId) {
          const id = Number(parsed.orderId);
          if (!Number.isNaN(id)) return id;
        }
      } catch {
        // fallback below
      }
    }

    const idPart = (orderIdRaw || '').split('_')[0];
    const id = Number(idPart);
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid callback orderId');
    }
    return id;
  }

  async handleMomoCallback(params: any) {
    this.logger.log(`[MoMo] Callback payload: ${JSON.stringify(params)}`);

    const partnerCode = params?.partnerCode ?? '';
    const orderId = params?.orderId ?? '';
    const requestId = params?.requestId ?? '';
    const amount = params?.amount ?? '';
    const orderInfo = params?.orderInfo ?? '';
    const orderType = params?.orderType ?? '';
    const transId = params?.transId ?? '';
    const resultCode = params?.resultCode ?? '';
    const message = params?.message ?? '';
    const payType = params?.payType ?? '';
    const responseTime = params?.responseTime ?? '';
    const extraData = params?.extraData ?? '';
    const signature = params?.signature ?? '';

    if (!signature) {
      throw new BadRequestException('Missing signature');
    }

    const accessKey = this.getRequiredConfig('MOMO_ACCESS_KEY');
    const secretKey = this.getRequiredConfig('MOMO_SECRET_KEY');

    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    if (signature !== expectedSignature) {
      this.logger.error('[MoMo] Invalid signature');
      throw new BadRequestException('Invalid signature');
    }

    const actualOrderId = this.decodeOrderIdFromCallback(orderId, extraData);

    if (Number(resultCode) === 0) {
      const order = await this.ordersService.findOne(actualOrderId);
      if (order.status !== OrderStatus.PAID) {
        await this.ordersService.updateStatus(actualOrderId, { status: OrderStatus.PAID });
        this.logger.log(`[MoMo] Order #${actualOrderId} marked as PAID`);
      } else {
        this.logger.log(`[MoMo] Order #${actualOrderId} already PAID (idempotent callback)`);
      }
    } else {
      this.logger.warn(`[MoMo] Payment failed for order #${actualOrderId}, resultCode=${resultCode}`);
    }

    return { status: 200, message: 'Received callback safely' };
  }
}
