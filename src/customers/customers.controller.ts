import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { CreateCustomerDTO } from './dto/create-customer.request.dto';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
    constructor(@Inject(CustomersService) private readonly customerService: CustomersService){}
    @Post()
    async create(@Body() createCustomerDto: CreateCustomerDTO){
        try {
            return await this.customerService.create(createCustomerDto);
        } catch (error) {
            throw error;
        }
    }

    @Get()
    async findAll(){
        try {
            return await this.customerService.getAll();
        } catch (error) {
            throw error;
        }
    }

    @Post("/email")
    @HttpCode(200)
    async getCustomerDataByEmail(@Body() customer: {email: string}){
        try {
            return await this.customerService.getByEmail(customer.email)
        } catch (error) {
            throw error;
        }
    }
}
