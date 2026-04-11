import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from '../carts/entities/cart-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { WishlistItem } from '../wishlist/entities/wishlist-item.entity';

@Injectable()
export class DataTransferService {
  private readonly logger = new Logger(DataTransferService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Category) private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Cart) private readonly cartsRepo: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemsRepo: Repository<CartItem>,
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(WishlistItem) private readonly wishlistRepo: Repository<WishlistItem>,
  ) {}

  async exportAll() {
    const users = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .getMany();

    const payload = {
      meta: {
        exportedAt: new Date().toISOString(),
        source: 'ecommerce-reactjs',
        version: 1,
      },
      data: {
        categories: await this.categoriesRepo.find({ order: { id: 'ASC' } }),
        products: await this.productsRepo.find({ order: { id: 'ASC' } }),
        users,
        carts: await this.cartsRepo.find({ order: { id: 'ASC' } }),
        cartItems: await this.cartItemsRepo.find({ order: { id: 'ASC' } }),
        orders: await this.ordersRepo.find({ order: { id: 'ASC' } }),
        orderItems: await this.orderItemsRepo.find({ order: { id: 'ASC' } }),
        wishlistItems: await this.wishlistRepo.find({ order: { id: 'ASC' } }),
      },
    };

    this.logger.log(
      `[Data Transfer] Exported: categories=${payload.data.categories.length}, products=${payload.data.products.length}, users=${payload.data.users.length}, orders=${payload.data.orders.length}`,
    );

    return payload;
  }

  async importAll(payload: any, replaceExisting = false) {
    const data = payload?.data || payload;

    const categories = data?.categories || [];
    const products = data?.products || [];
    const users = data?.users || [];
    const carts = data?.carts || [];
    const cartItems = data?.cartItems || [];
    const orders = data?.orders || [];
    const orderItems = data?.orderItems || [];
    const wishlistItems = data?.wishlistItems || [];

    await this.dataSource.transaction(async (manager) => {
      if (replaceExisting) {
        await manager.delete(WishlistItem, {});
        await manager.delete(OrderItem, {});
        await manager.delete(Order, {});
        await manager.delete(CartItem, {});
        await manager.delete(Cart, {});
        await manager.delete(Product, {});
        await manager.delete(Category, {});
        await manager.delete(User, {});
      }

      if (categories.length) await manager.save(Category, categories);
      if (products.length) await manager.save(Product, products);
      if (users.length) await manager.save(User, users);
      if (carts.length) await manager.save(Cart, carts);
      if (cartItems.length) await manager.save(CartItem, cartItems);
      if (orders.length) await manager.save(Order, orders);
      if (orderItems.length) await manager.save(OrderItem, orderItems);
      if (wishlistItems.length) await manager.save(WishlistItem, wishlistItems);
    });

    this.logger.log(
      `[Data Transfer] Imported: categories=${categories.length}, products=${products.length}, users=${users.length}, orders=${orders.length}, replaceExisting=${replaceExisting}`,
    );

    return {
      success: true,
      imported: {
        categories: categories.length,
        products: products.length,
        users: users.length,
        carts: carts.length,
        cartItems: cartItems.length,
        orders: orders.length,
        orderItems: orderItems.length,
        wishlistItems: wishlistItems.length,
      },
      replaceExisting,
    };
  }
}
