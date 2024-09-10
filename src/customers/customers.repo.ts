import { Injectable, Logger } from "@nestjs/common";
import { CreateCustomerDTO } from "./dto/create-customer.request.dto";
import { InjectModel } from "@nestjs/sequelize";
import { CustomerEntity } from "./entity/customers.entity";
import { VoucherEntity } from "../vouchers/entity/voucher.entity";

@Injectable()
export class CustomersRepo {
  private logger: Logger
  constructor(
    @InjectModel(CustomerEntity) 
    private customerModel :typeof CustomerEntity){
      this.logger = new Logger(CustomersRepo.name);
      
    }
  async create(createCustomerDto: CreateCustomerDTO): Promise<CustomerEntity| null> {
    try {
     console.log(`Creating Customer ${JSON.stringify(createCustomerDto)}`);
     const customer = await this.customerModel.create(createCustomerDto);
     return customer;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  
  
  async findById(customer: string): Promise<CustomerEntity| null> {
    try {
      const customerEntity: CustomerEntity = await this.customerModel.findByPk(customer);
      return customerEntity;
    } catch (error) {
      this.logger.error(`error while finding customer ${customer}`);
      throw error
    }
  }
  async findByEmail(customer: string): Promise<CustomerEntity| null> {
    try {
      const customerEntity =await this.customerModel.findOne({where: {email: customer}});
      return customerEntity;
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  async findAll(): Promise<CustomerEntity[] | null> {
    try {
      return await this.customerModel.findAll({
        include: VoucherEntity
      })
    } catch (error) {
      throw error;
    }
  }
}
