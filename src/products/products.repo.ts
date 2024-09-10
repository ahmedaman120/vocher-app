import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ProductEntity } from "./entity/product.entity";
import { CreateProductRequestDto } from "./dto/createProduct.request.dto";

@Injectable()
export class ProductsRepo {
    constructor(@InjectModel(ProductEntity) private readonly productModel: typeof ProductEntity){}

    async create(createProductDto: CreateProductRequestDto):Promise<ProductEntity| null>{
        try {
            return this.productModel.create(createProductDto);
        } catch (error) {
            throw error;
        }
    }

    async findById(id:string):Promise<ProductEntity| null>{
        try {
            return this.productModel.findByPk(id);
        } catch (error) {
            throw error;
        }
    }

    async findAll():Promise<ProductEntity[]| null>{
        try {
            return this.productModel.findAll();
        } catch (error) {
            throw error;
        }
    }
}
