import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { DatabaseModuleModule } from '../database-module/database-module.module';
import { CustomersRepo } from './customers.repo';
import { instance, mock, verify, when } from 'ts-mockito';
import { CreateCustomerDTO } from './dto/create-customer.request.dto';
import { CustomerEntity } from './entity/customers.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CustomersService', () => {
  let service: CustomersService;
  let MockCustomerRepo: CustomersRepo = mock(CustomersRepo)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService,
        {
          provide: CustomersRepo,
          useValue: instance(MockCustomerRepo)
        }],
      imports: [
        DatabaseModuleModule,
      ]
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user using CreateCustomerDto', async () => {
    const customerDTO: CreateCustomerDTO = {username:"test1", email:"test@g.com"};
    when(MockCustomerRepo.create(customerDTO)).thenResolve(instance(mock(CustomerEntity)))
    when(MockCustomerRepo.findByEmail(customerDTO.email)).thenResolve(null);

    await service.create(customerDTO)
    verify(MockCustomerRepo.create(customerDTO)).called();

  })

  it('should throw excption if email used before ', async () => {
    const customerDTO: CreateCustomerDTO = {username:"test2", email:"test2@g.com"};
    when(MockCustomerRepo.findByEmail(customerDTO.email)).thenResolve(instance(mock(CustomerEntity)));
   
    try {
      await service.create(customerDTO)
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException)
    }
  })

  it('should return all customers entities ', async () => {
    
    when(MockCustomerRepo.getAll()).thenResolve([instance(mock(CustomerEntity)),instance(mock(CustomerEntity))]);
   
   const result =await service.getAll()
   expect(result.length).toEqual(2)
   expect(result[0].vouchers).toBeDefined()
   expect(result[1].vouchers).toBeDefined()
  })


  it('should throw excption if email not found findByEmail ', async () => {
    const email: string = "test2";
    when(MockCustomerRepo.findByEmail(email)).thenResolve(null);
   
    try {
      await service.getByEmail(email)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
    }
  })
});
