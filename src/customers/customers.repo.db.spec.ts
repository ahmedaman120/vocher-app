import { getModelToken } from "@nestjs/sequelize";
import { TestingModule, Test } from "@nestjs/testing";
import { Sequelize } from "sequelize";
import { DatabaseModuleModule } from "../database-module/database-module.module";
import { CustomersRepo } from "./customers.repo";
import { CreateCustomerDTO } from "./dto/create-customer.request.dto";
import { CustomerEntity } from "./entity/customers.entity";

describe("UserRepo with db",()=>{
  let service2: CustomersRepo;
  let sequelize: Sequelize;
  beforeAll(async () => {

    const module2: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModuleModule
      ]
      , providers: [
        CustomersRepo,
        {
          provide: getModelToken(CustomerEntity),
          useValue:CustomerEntity,
        },
      ],
    }).compile();

    service2 = module2.get<CustomersRepo>(CustomersRepo);
    sequelize = module2.get<Sequelize>('SEQUELIZE');
  })
  afterAll(async () => {
    if (sequelize) {
      await sequelize.close(); // Close the Sequelize connection
    }
  });

  it('should be defined', () => {
    expect(service2).toBeDefined();
  });
  it("should call create function to create customer in db", async () => {
    // given 
    const createCustomerDto: CreateCustomerDTO = { username: 'testuser2', email: 'test2@example.com' };
    // act 
    const customer = await service2.create(createCustomerDto);
    // excpect 
    expect(customer).toBeInstanceOf(CustomerEntity)
  })

  it("should call findByEmail to get customer entity",async()=>{
    const createCustomerDto: CreateCustomerDTO = { username: 'testuser3', email: 'test3@example.com' };
    const customerCreated = await service2.create(createCustomerDto);

    const customer= "test3@example.com"
   
    const result = await service2.findByEmail(customer);
  
    expect(result.username).toEqual("testuser3")
    expect(result.email).toEqual(customer);
  })

  it("should call findAll to get all customers entity",async()=>{
    
   
    const result = await service2.findAll();
  
    expect(result.length).toEqual(2)
  })
})
