import { Test, TestingModule } from '@nestjs/testing';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { VouchersRepo } from './vouchers.repo';
import { getModelToken } from '@nestjs/sequelize';
import { CustomerEntity } from '../customers/entity/customers.entity';
import { ProductEntity } from '../products/entity/product.entity';
import { VoucherEntity } from './entity/voucher.entity';
import { DatabaseModuleModule } from '../database-module/database-module.module';
import { makeCounterProvider, makeHistogramProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';

describe('VouchersController', () => {
  let controller: VouchersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VouchersController],
      imports:[DatabaseModuleModule,
        PrometheusModule.register({
          path: '/voucher/metrics',
        }),
      ],
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
      ]
    }).compile();

    controller = module.get<VouchersController>(VouchersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
