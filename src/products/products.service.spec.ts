import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepo } from './products.repo';
import { ProductEntity } from './entity/product.entity';
import { VoucherEntity } from '../vouchers/entity/voucher.entity';
import { getModelToken } from '@nestjs/sequelize';
import { DatabaseModuleModule } from '../database-module/database-module.module';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService,
        ProductsRepo,
        {
          provide: getModelToken(ProductEntity),
          useValue: ProductEntity
        },
        {
          provide: getModelToken(VoucherEntity),
          useValue: VoucherEntity
        }],
      imports:[DatabaseModuleModule]

    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
