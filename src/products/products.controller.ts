import { Body, Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductRequestDto } from './dto/createProduct.request.dto';

@Controller('products')
export class ProductsController {
    constructor(@Inject(ProductsService) private readonly productService: ProductsService){}

    @Post()
    async create(@Body() createProductDto: CreateProductRequestDto){
        try {
            return await this.productService.create(createProductDto);
        } catch (error) {
            throw error;
        }
    }

    @Get()
    async findAll(){
        try {
            return await this.productService.getAll();
        } catch (error) {
            throw error;
        }
    }

    @Get(":id")
    @HttpCode(200)
    async getCustomerDataByEmail(@Param('id') id: string){
        try {
            return await this.productService.findById(id)
        } catch (error) {
            throw error;
        }
    }
}
