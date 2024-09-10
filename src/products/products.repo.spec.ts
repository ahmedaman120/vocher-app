import { getModelToken } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { Sequelize } from 'sequelize';
import { DatabaseModuleModule } from '../database-module/database-module.module';
import { VoucherEntity } from '../vouchers/entity/voucher.entity';
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { ProductEntity } from './entity/product.entity';
import { ProductsRepo } from './products.repo';
import { CreateProductRequestDto } from './dto/createProduct.request.dto';
import { CustomersService } from '../customers/customers.service';
import { v4 as uuidv4 } from 'uuid';

describe('ProductsRepo', () => {
  const MockProductEntity: typeof ProductEntity = mock(ProductEntity) as unknown as typeof ProductEntity;
  let service: ProductsRepo;
  let productEntityMock: ProductEntity;
  const MockVoucherEntity = mock(VoucherEntity);
  let sequelize: Sequelize;
  beforeAll(async()=>{
    
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModuleModule,

      ]
      , providers: [
        ProductsRepo,
        {
          provide: getModelToken(ProductEntity),
          useValue: instance(MockProductEntity),
        },
        {
          provide: getModelToken(VoucherEntity),
          useValue: instance(MockVoucherEntity),
        },
        
      ],
    }).compile();

    service = module.get<ProductsRepo>(ProductsRepo);
    sequelize = module.get<Sequelize>('SEQUELIZE');
  })
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close(); // Close the Sequelize connection
    }

    reset(MockProductEntity);
    reset(MockVoucherEntity);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should call create from product model to create offer",async()=>{
    const createProductDto: CreateProductRequestDto = {name: "test", percentage:5.2};
    when(MockProductEntity.create(createProductDto)).thenResolve(instance(mock(ProductEntity)));

    await service.create(createProductDto)
    verify(MockProductEntity.create(createProductDto)).called()
  })

  it("should call findById to get prduct offer",async()=>{
    const id = uuidv4()
    when(MockProductEntity.findByPk(id)).thenResolve(instance(mock(ProductEntity)))
    await service.findById(id);
    verify(MockProductEntity.findByPk(id)).called()
  })

  it("should call findAll to get prduct offer",async()=>{
    when(MockProductEntity.findAll()).thenResolve([instance(mock(ProductEntity))])
    const result= await service.findAll();
    verify(MockProductEntity.findAll()).called()
    expect(result.length).toEqual(1);
  })
});
