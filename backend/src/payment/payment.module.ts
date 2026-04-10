import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrdersModule } from '../orders/orders.module';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [OrdersModule, CartsModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
