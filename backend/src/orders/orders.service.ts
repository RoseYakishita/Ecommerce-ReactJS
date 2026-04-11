import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus, PaymentMethod } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartsService } from '../carts/carts.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartsService: CartsService,
  ) {}

  async createFromCart(userId: number, paymentMethodStr?: string) {
    const cart = await this.cartsService.getCart(userId);
    
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cannot create order from an empty cart');
    }

    let itemsTotal = 0;
    
    // Calculate items subtotal and prepare items data
    const orderItemsData = cart.items.map(cartItem => {
      const priceAtPurchase = Number(cartItem.product.price);
      const quantity = Number(cartItem.quantity);
      itemsTotal += (priceAtPurchase * quantity);
      
      return {
        productId: cartItem.productId,
        quantity,
        priceAtPurchase,
      };
    });

    // Explicit costs calculation
    const subtotal = Math.round(itemsTotal * 100) / 100;
    const shippingUsd = 1.00; // Flat rate 1 USD
    const taxAmount = Math.round(subtotal * 0.08 * 100) / 100; // 8% Tax
    
    // Final total calculation
    const finalTotal = Math.round((subtotal + shippingUsd + taxAmount) * 100) / 100;

    let method = PaymentMethod.CASH;
    if (paymentMethodStr === 'MOMO') {
      method = PaymentMethod.MOMO;
    }

    // Professional Log for debugging
    this.logger.log(`[LOG-ID-V3] [Order Created] User: ${userId}, Items Total: ${subtotal}, Tax: ${taxAmount}, Shipping: ${shippingUsd}, Final Order Total: ${finalTotal}`);

    // Create Order
    const order = this.ordersRepository.create({
      userId,
      totalAmount: finalTotal,
      status: OrderStatus.PENDING,
      paymentMethod: method,
    });
    const savedOrder = await this.ordersRepository.save(order);

    // Create Order Items
    const orderItems = orderItemsData.map(item => 
      this.orderItemsRepository.create({
        ...item,
        orderId: savedOrder.id,
      })
    );
    await this.orderItemsRepository.save(orderItems);

    // Clear the cart
    await this.cartsService.clearCart(userId);

    return this.findOne(savedOrder.id);
  }

  findAll(userId?: number) {
    const where = userId
      ? { userId }
      : { status: In([OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED]) };

    return this.ordersRepository.find({
      where,
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product']
    });
    
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    const fromStatus = order.status;
    order.status = updateOrderStatusDto.status;
    const saved = await this.ordersRepository.save(order);

    this.logger.log(`[Order Audit] Order #${id} status changed: ${fromStatus} -> ${saved.status}`);
    return saved;
  }
}
