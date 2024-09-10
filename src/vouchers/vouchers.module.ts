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

@Module({
  imports:[DatabaseModuleModule],
  providers: [VouchersService
    ,VouchersRepo,
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
    }],
  controllers: [VouchersController],
  exports: [VouchersService, VouchersRepo]
})
export class VouchersModule {}
