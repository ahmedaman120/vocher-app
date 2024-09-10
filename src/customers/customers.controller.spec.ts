import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersRepo } from './customers.repo';
import { getModelToken } from '@nestjs/sequelize';
import { VoucherEntity } from '../vouchers/entity/voucher.entity';
import { CustomerEntity } from './entity/customers.entity';

describe('CustomersController', () => {
  let controller: CustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [CustomersService, CustomersRepo,
        {
          provide: getModelToken(VoucherEntity),
          useValue: VoucherEntity,
        },
        {
          provide: getModelToken(CustomerEntity),
          useValue: CustomerEntity,
        },]
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
