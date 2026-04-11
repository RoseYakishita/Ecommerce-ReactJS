import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataTransferController } from './data-transfer.controller';
import { DataTransferService } from './data-transfer.service';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from '../carts/entities/cart-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { WishlistItem } from '../wishlist/entities/wishlist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, User, Cart, CartItem, Order, OrderItem, WishlistItem])],
  controllers: [DataTransferController],
  providers: [DataTransferService],
})
export class DataTransferModule {}
