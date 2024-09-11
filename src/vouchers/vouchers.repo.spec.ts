import { CustomerEntity } from '../customers/entity/customers.entity';
import { VouchersRepo } from './vouchers.repo';
import { ProductEntity } from '../products/entity/product.entity';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { getModelToken } from '@nestjs/sequelize';
import { DatabaseModuleModule } from '../database-module/database-module.module';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize';
import { VoucherEntity } from './entity/voucher.entity';
import { CreateVoucherDto } from './dto/createVoucherDto.dto';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment/moment';

describe('VouchersRepo', () => {

  const MockProductEntity: typeof ProductEntity = mock(ProductEntity) as unknown as typeof ProductEntity;
  let service: VouchersRepo;
  let productEntityMock: ProductEntity;
  const MockCustomerEntity = mock(CustomerEntity) as unknown as typeof CustomerEntity;
  const MockVoucherEntity = mock(VoucherEntity) as unknown as typeof VoucherEntity;
  let sequelize: Sequelize;

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModuleModule,

      ]
      , providers: [
        VouchersRepo,
        {
          provide: getModelToken(ProductEntity),
          useValue: instance(MockProductEntity),
        },
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

    service = module.get<VouchersRepo>(VouchersRepo);
    sequelize = module.get<Sequelize>('SEQUELIZE');
  })
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close(); // Close the Sequelize connection
    }

    reset(MockProductEntity);
    reset(MockCustomerEntity);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should create voucher using create function from model", async () => {
    const today = new Date();

    const expireAfterThrteenDays = new Date();
    expireAfterThrteenDays.setDate(today.getDate() + 30);

    const voucher: CreateVoucherDto = {
      productId: uuidv4,
      expriyDate: expireAfterThrteenDays
    }
    const customers = [instance(mock(CustomerEntity)),
    instance(mock(CustomerEntity)),
    instance(mock(CustomerEntity)),
    instance(mock(CustomerEntity))]
    const vochers = [instance(mock(VoucherEntity)),
    instance(mock(VoucherEntity)),
    instance(mock(VoucherEntity)),
    instance(mock(VoucherEntity))]
    const customersVouchers = customers.map((value) => {
      return {
        ...voucher,
        code: service._codeGenerator(),
        customerId: value.id,
      }
    })
    when(MockCustomerEntity.findAll()).thenResolve(customers)
    when(MockVoucherEntity.bulkCreate(anything())).thenResolve(vochers);
    
      const result = await service.createVoucher(voucher);
      console.log(result)
      expect(result.length).toEqual(4)
   
  })

  it("should throw error if expiry date in the past", async () => {
    const today = new Date();

    const expireAfterThrteenDays = new Date();
    expireAfterThrteenDays.setDate(today.getDate() - 30);

    const voucher: CreateVoucherDto = {
      productId: uuidv4,
      expriyDate: expireAfterThrteenDays
    }

    when(MockVoucherEntity.create(voucher)).thenResolve(instance(mock(VoucherEntity)));
    try {

      await service.createVoucher(voucher);
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual("Date should be in the future")
    }
  })

  it("should throw error if customer enter invalid email",async()=>{
    const voucherRedeem = {email:"test@g.com",code:"sjkasd"};
    when(MockCustomerEntity.findOne(anything())).thenResolve(null);

    try {
      await service.redeemVoucherTransaction(voucherRedeem.email, voucherRedeem.code);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("Customer not found")
    }
    
  })


  it("should throw error if customer enter invalid code",async()=>{
    const voucherRedeem = {email:"test@g.com",code:"sjkasd"};
    
    when(MockCustomerEntity.findOne(anything())).thenResolve(instance(mock(CustomerEntity)));
    when(MockVoucherEntity.findOne(anything())).thenResolve(null);

    try {
      await service.redeemVoucherTransaction(voucherRedeem.email, voucherRedeem.code);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("Voucher not found")
    }
    
  })

  it("should throw error if customer enter valid code but expiry date is done",async()=>{
    const voucherRedeem = {email:"test@g.com",code:"sjkasd"};
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate()-3);
    when(MockCustomerEntity.findOne(anything())).thenResolve(instance(mock(CustomerEntity)));
    const mockVoucherWithExpiration = instance(mock(VoucherEntity))
    when(MockVoucherEntity.findOne(anything())).thenResolve(mockVoucherWithExpiration);
    when(mock(VouchersRepo).getExpiryDate(anything())).thenReturn(pastDate);
    try {
      await service.redeemVoucherTransaction(voucherRedeem.email, voucherRedeem.code);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("Vocher is expired")
    }
    
  })
});
