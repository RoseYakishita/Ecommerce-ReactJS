import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus, PaymentMethod } from '../orders/entities/order.entity';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly cartsService: CartsService,
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

  private calcCartTotals(cart: any) {
    let itemsTotal = 0;

    for (const cartItem of cart.items || []) {
      const priceAtPurchase = Number(cartItem?.product?.price || 0);
      const quantity = Number(cartItem?.quantity || 0);
      itemsTotal += priceAtPurchase * quantity;
    }

    const subtotal = Math.round(itemsTotal * 100) / 100;
    const shippingUsd = 1.0;
    const taxAmount = Math.round(subtotal * 0.08 * 100) / 100;
    const finalTotalUsd = Math.round((subtotal + shippingUsd + taxAmount) * 100) / 100;

    return { subtotal, shippingUsd, taxAmount, finalTotalUsd };
  }

  async createMomoPayment(userId: number) {
    const cart = await this.cartsService.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cannot create MoMo payment from an empty cart');
    }

    const { finalTotalUsd } = this.calcCartTotals(cart);

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

    const exchangeRate = Number(this.configService.get<string>('MOMO_EXCHANGE_RATE') || 25000);
    const amount = String(Math.max(0, Math.round(Number(finalTotalUsd) * exchangeRate)));

    const requestId = `${partnerCode}_${Date.now()}`;
    const momoOrderId = `U${userId}_${Date.now()}`;
    const orderInfo = `Thanh toan gio hang user #${userId}`;
    const extraData = Buffer.from(
      JSON.stringify({
        userId,
        flow: 'CREATE_ORDER_AFTER_PAID',
      }),
      'utf8',
    ).toString('base64');

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

    this.logger.log(`[MoMo] Create payment for user #${userId}, amount ${amount} VND`);

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

  private decodeCallbackContext(orderIdRaw: string, extraDataRaw: string): { orderId?: number; userId?: number } {
    if (extraDataRaw) {
      try {
        const decoded = Buffer.from(extraDataRaw, 'base64').toString('utf8');
        const parsed = JSON.parse(decoded);

        const userId = Number(parsed?.userId);
        if (!Number.isNaN(userId) && userId > 0) {
          return { userId };
        }

        const orderIdFromExtra = Number(parsed?.orderId);
        if (!Number.isNaN(orderIdFromExtra) && orderIdFromExtra > 0) {
          return { orderId: orderIdFromExtra };
        }
      } catch {
        // fallback below
      }
    }

    const idPart = (orderIdRaw || '').split('_')[0].replace(/^U/i, '');
    const id = Number(idPart);
    if (Number.isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid callback orderId/extraData');
    }

    return { orderId: id };
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

    const callbackCtx = this.decodeCallbackContext(orderId, extraData);

    if (Number(resultCode) === 0) {
      // New flow: create order only after successful payment
      if (callbackCtx.userId) {
        const userId = callbackCtx.userId;
        const cart = await this.cartsService.getCart(userId);

        // Idempotent handling: callback may be retried by MoMo.
        if (!cart.items || cart.items.length === 0) {
          this.logger.log(`[MoMo] Callback for user #${userId} already processed (cart empty)`);
          return { status: 200, message: 'Already processed' };
        }

        const createdOrder = await this.ordersService.createFromCart(userId, PaymentMethod.MOMO);
        if (createdOrder.status !== OrderStatus.PAID) {
          await this.ordersService.updateStatus(createdOrder.id, { status: OrderStatus.PAID });
        }

        this.logger.log(`[MoMo] Created order #${createdOrder.id} and marked as PAID for user #${userId}`);
        return { status: 200, message: 'Received callback safely' };
      }

      // Backward compatible flow: old callback with orderId
      if (callbackCtx.orderId) {
        const actualOrderId = callbackCtx.orderId;
        const order = await this.ordersService.findOne(actualOrderId);
        if (order.status !== OrderStatus.PAID) {
          await this.ordersService.updateStatus(actualOrderId, { status: OrderStatus.PAID });
          this.logger.log(`[MoMo] Order #${actualOrderId} marked as PAID`);
        } else {
          this.logger.log(`[MoMo] Order #${actualOrderId} already PAID (idempotent callback)`);
        }
      }
    } else {
      this.logger.warn(
        `[MoMo] Payment failed, orderId=${orderId || 'N/A'}, userId=${callbackCtx.userId || 'N/A'}, resultCode=${resultCode}`,
      );
    }

    return { status: 200, message: 'Received callback safely' };
  }
}
