import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartsService } from '../carts/carts.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartsService: CartsService,
  ) {}

  async createFromCart(userId: number) {
    const cart = await this.cartsService.getCart(userId);
    
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cannot create order from an empty cart');
    }

    let totalAmount = 0;
    
    // Calculate total and prepare items
    const orderItemsData = cart.items.map(cartItem => {
      const priceAtPurchase = cartItem.product.price;
      const quantity = cartItem.quantity;
      totalAmount += (priceAtPurchase * quantity);
      
      return {
        productId: cartItem.productId,
        quantity,
        priceAtPurchase,
      };
    });

    // Create Order
    const order = this.ordersRepository.create({
      userId,
      totalAmount,
      status: OrderStatus.PENDING,
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
