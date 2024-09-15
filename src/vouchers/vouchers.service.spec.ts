import { Test, TestingModule } from '@nestjs/testing';
import { VouchersService } from './vouchers.service';
import { getModelToken } from '@nestjs/sequelize';
import { VoucherEntity } from './entity/voucher.entity';
import { ProductEntity } from '../products/entity/product.entity';
import { CustomerEntity } from '../customers/entity/customers.entity';
import { DatabaseModuleModule } from '../database-module/database-module.module';
import { VouchersRepo } from './vouchers.repo';
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

describe('VouchersService', () => {
  let service: VouchersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          provide: getModelToken(ProductEntity),
          useValue: ProductEntity,
        },
        {
          provide: getModelToken(CustomerEntity),
          useValue: CustomerEntity,
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
    }).compile();

    service = module.get<VouchersService>(VouchersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
