import { Module } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { VouchersRepo } from './vouchers.repo';
import { getModelToken } from '@nestjs/sequelize';
import { CustomerEntity } from 'src/customers/entity/customers.entity';
import { VoucherEntity } from './entity/voucher.entity';
import { ProductEntity } from 'src/products/entity/product.entity';
import { ProductsService } from 'src/products/products.service';
import { ProductsRepo } from 'src/products/products.repo';
import { DatabaseModuleModule } from 'src/database-module/database-module.module';
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    DatabaseModuleModule,
    PrometheusModule.register({
      path: '/voucher/metrics',
    }),
  ],
  providers: [
    VouchersService,
    VouchersRepo,
    {
      provide: getModelToken(VoucherEntity),
      useValue: VoucherEntity,
    },
    {
      provide: getModelToken(CustomerEntity),
      useValue: CustomerEntity,
    },
    {
      provide: getModelToken(ProductEntity),
      useValue: ProductEntity,
    },
    makeCounterProvider({
      name: 'voucher_requests_total',
      help: 'Tracks the number of voucher-related operations',
      labelNames: ['status'],
    }),
    makeHistogramProvider({
      name: 'voucher_request_duration_seconds',
      help: 'Duration of voucher requests',
      labelNames: ['status'],
    }),
  ],
  controllers: [VouchersController],
  exports: [VouchersService, VouchersRepo],
})
export class VouchersModule {}
