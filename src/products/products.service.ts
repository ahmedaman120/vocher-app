import { Inject, Injectable } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/createProduct.request.dto';
import { ProductEntity } from './entity/product.entity';
import { ProductsRepo } from './products.repo';

@Injectable()
export class ProductsService {
    constructor(@Inject(ProductsRepo) private readonly productRepo: ProductsRepo){}

    async create(offer: CreateProductRequestDto):Promise<ProductEntity|null>{
        try {
            const result = await this.productRepo.create(offer)
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string):Promise<ProductEntity|null>{
        try {
            const result = await this.productRepo.findById(id)
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getAll():Promise<ProductEntity[]|null>{
        try {
            const result = await this.productRepo.findAll()
            return result;
        } catch (error) {
            throw error;
        }
    }
}
