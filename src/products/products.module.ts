import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseModuleModule } from 'src/database-module/database-module.module';
import { CustomersModule } from 'src/customers/customers.module';
import { VouchersModule } from 'src/vouchers/vouchers.module';
import { ProductsRepo } from './products.repo';
import { getModelToken } from '@nestjs/sequelize';
import { ProductEntity } from './entity/product.entity';
import { VoucherEntity } from 'src/vouchers/entity/voucher.entity';

@Module({
  imports:[
    DatabaseModuleModule, 
    CustomersModule, 
    VouchersModule, 
    ProductsModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepo,
  {
    provide: getModelToken(ProductEntity),
    useValue: ProductEntity
  },
  {
    provide: getModelToken(VoucherEntity),
    useValue: VoucherEntity
  }],
  exports: [ProductsService],
})
export class ProductsModule {}
