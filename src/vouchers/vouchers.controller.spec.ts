import { Test, TestingModule } from '@nestjs/testing';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { VouchersRepo } from './vouchers.repo';
import { getModelToken } from '@nestjs/sequelize';
import { CustomerEntity } from '../customers/entity/customers.entity';
import { ProductEntity } from '../products/entity/product.entity';
import { VoucherEntity } from './entity/voucher.entity';
import { DatabaseModuleModule } from '../database-module/database-module.module';

describe('VouchersController', () => {
  let controller: VouchersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VouchersController],
      imports:[DatabaseModuleModule],
      providers:[
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
        }
      ]
    }).compile();

    controller = module.get<VouchersController>(VouchersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
