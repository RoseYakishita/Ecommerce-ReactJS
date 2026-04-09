import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CartsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
<<<<<<< HEAD
  exports: [OrdersService]
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
})
export class OrdersModule {}
