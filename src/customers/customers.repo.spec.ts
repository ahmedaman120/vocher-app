import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { CustomersRepo } from './customers.repo';
import { CustomerEntity } from './entity/customers.entity';
import { CreateCustomerDTO } from './dto/create-customer.request.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DatabaseModuleModule } from '../database-module/database-module.module';
import { Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { VoucherEntity } from '../vouchers/entity/voucher.entity';
describe('CustomersRepo', () => {
  const MockCustomerEntity: typeof CustomerEntity = mock(CustomerEntity) as unknown as typeof CustomerEntity;
  let service: CustomersRepo;
  let customerEntityMock: CustomerEntity;
  const MockVoucherEntity = mock(VoucherEntity)as unknown as typeof VoucherEntity;

  let sequelize: Sequelize;
  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModuleModule,
      ]
      , providers: [
        CustomersRepo,
        {
          provide: getModelToken(CustomerEntity),
          useValue: instance(MockCustomerEntity),
        },
        {
          provide: getModelToken(VoucherEntity),
          useValue: instance(MockVoucherEntity),
        }
      ],
    }).compile();

    service = module.get<CustomersRepo>(CustomersRepo);
    sequelize = module.get<Sequelize>('SEQUELIZE');
  })
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close(); // Close the Sequelize connection
    }

    reset(MockCustomerEntity);
    reset(MockVoucherEntity);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should call create function to create customer", async () => {
    // given 
    const createCustomerDto: CreateCustomerDTO = { username: 'testuser', email: 'test@example.com' };
    customerEntityMock = mock(CustomerEntity);
    when(MockCustomerEntity.create(createCustomerDto)).thenResolve(instance(customerEntityMock));
    // act 
    await service.create(createCustomerDto);
    // excpect 
    verify(MockCustomerEntity.create(createCustomerDto)).called()
  })

  it("should call findById to get customer entity", async () => {
    const customer = uuidv4()
    customerEntityMock = mock(CustomerEntity);
    when(MockCustomerEntity.findByPk(customer)).thenResolve(instance(customerEntityMock))

    const result = await service.findById(customer);

    verify(MockCustomerEntity.findByPk(customer)).called()
    expect(result).toEqual(instance(customerEntityMock))
  })

  it("should call findByEmail to get customer entity", async () => {
    const customer = "test@example.com"
    customerEntityMock = mock(CustomerEntity);
    when(MockCustomerEntity.findOne(anything())).thenResolve(instance(customerEntityMock));
    const result = await service.findByEmail(customer);

    verify(MockCustomerEntity.findOne(anything())).called();
    expect(result).toEqual(instance(customerEntityMock))
  })

  it('should call findAll and return an array of customer entities', async () => {
    // Arrange
 
    const mockCustomer1 = mock(CustomerEntity);
    const mockCustomer2 = mock(CustomerEntity);
    const mockCustomers = [
      instance(mockCustomer1),
      instance(mockCustomer2)
    ];

    when(MockCustomerEntity.findAll(anything())).thenResolve(mockCustomers);


    // Act
    const result = await service.getAll();

    // Assert
    verify(MockCustomerEntity.findAll(anything())).called();
    expect(result).toEqual(mockCustomers);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

  });
});

