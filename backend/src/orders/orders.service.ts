<<<<<<< HEAD
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentMethod } from './entities/order.entity';
=======
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
import { OrderItem } from './entities/order-item.entity';
import { CartsService } from '../carts/carts.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
<<<<<<< HEAD
  private readonly logger = new Logger(OrdersService.name);
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartsService: CartsService,
  ) {}

<<<<<<< HEAD
  async createFromCart(userId: number, paymentMethodStr?: string) {
=======
  async createFromCart(userId: number) {
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    const cart = await this.cartsService.getCart(userId);
    
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cannot create order from an empty cart');
    }

<<<<<<< HEAD
    let itemsTotal = 0;
    
    // Calculate items subtotal and prepare items data
    const orderItemsData = cart.items.map(cartItem => {
      const priceAtPurchase = Number(cartItem.product.price);
      const quantity = Number(cartItem.quantity);
      itemsTotal += (priceAtPurchase * quantity);
=======
    let totalAmount = 0;
    
    // Calculate total and prepare items
    const orderItemsData = cart.items.map(cartItem => {
      const priceAtPurchase = cartItem.product.price;
      const quantity = cartItem.quantity;
      totalAmount += (priceAtPurchase * quantity);
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
      
      return {
        productId: cartItem.productId,
        quantity,
        priceAtPurchase,
      };
    });

<<<<<<< HEAD
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
=======
    // Create Order
    const order = this.ordersRepository.create({
      userId,
      totalAmount,
      status: OrderStatus.PENDING,
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
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
    const where = userId ? { userId } : {};
    return this.ordersRepository.find({
      where,
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
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
    order.status = updateOrderStatusDto.status;
    return this.ordersRepository.save(order);
  }
}
