import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { getModelToken } from '@nestjs/sequelize';
import { VoucherEntity } from '../vouchers/entity/voucher.entity';
import { CustomerEntity } from './entity/customers.entity';
import { CustomersRepo } from './customers.repo';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService,
    {
      provide: getModelToken(VoucherEntity),
      useValue: VoucherEntity,
    },
    {
      provide: getModelToken(CustomerEntity),
      useValue: CustomerEntity,
    },
    CustomersRepo
  ],
  exports:[CustomersService]
})
export class CustomersModule {}
