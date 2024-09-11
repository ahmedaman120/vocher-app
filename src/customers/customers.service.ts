import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomersRepo } from './customers.repo';
import { CreateCustomerDTO } from './dto/create-customer.request.dto';
import { CustomerEntity } from './entity/customers.entity';

@Injectable()
export class CustomersService {
    constructor(@Inject(CustomersRepo) private readonly customerRepo: CustomersRepo){}

    async create(customerDto: CreateCustomerDTO):Promise<CustomerEntity | null >{
        try {
            if(!this.customerRepo.findByEmail(customerDto.email)){
                throw new ForbiddenException("this email is used")
            }
            return this.customerRepo.create(customerDto);
        } catch (error) {
            console.log(error)
         throw error;   
        }
    }

    async getAll():Promise<CustomerEntity[]| null>{
        try {
            return await this.customerRepo.getAll()
        } catch (error) {
            throw error;
        }
    }

    async getByEmail(customerEmail: string):Promise<CustomerEntity| null>{
        try {
            const result =  await this.customerRepo.findByEmail(customerEmail);
            if(!result){
                throw new NotFoundException("this email not in our db")
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}
