import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { VoucherEntity } from "./entity/voucher.entity";
import { CustomerEntity } from "../customers/entity/customers.entity";
import { ProductEntity } from "../products/entity/product.entity";
import { CreateVoucherDto } from "./dto/createVoucherDto.dto";
import * as voucher_codes from "voucher-code-generator";
import { Sequelize } from "sequelize";
@Injectable()
export class VouchersRepo {
    constructor(@InjectModel(VoucherEntity) private voucherModel: typeof VoucherEntity,
        @InjectModel(CustomerEntity) private customerModel:typeof CustomerEntity,
        @InjectModel(ProductEntity) private productEntity:typeof ProductEntity,
        @Inject("SEQUELIZE") private sequelize: Sequelize
    ){}

    async createVoucher(voucherDTO: CreateVoucherDto):Promise<VoucherEntity[]| null>{
        try {
            this._vaidateVocher(voucherDTO)
            const customers = await this.customerModel.findAll();
            const customersVouchers = customers.map((value)=>{
                console.log(value.id)
                return {
                    ...voucherDTO,
                    code: this._codeGenerator(),
                    customerId: value.id,
                }
            })
            return await this.voucherModel.bulkCreate(customersVouchers);
        } catch (error) {
            console.log("error",error)
            throw error
            
        }
    }
    _vaidateVocher(voucherDTO: CreateVoucherDto){
        if(voucherDTO.expriyDate < new Date()){
            throw new Error("Date should be in the future");
        }
    }

    async validateRedeenVoucher(email: string, code: string){
        const customer = this.customerModel.findOne({where: {email}})
        if(!customer){
            throw new Error("Customer not found");
        }

        const voucher = await this.voucherModel.findOne({
            where:{
                code,
                usedAt: null
            }
        })
        if(!voucher){
            throw new Error("Voucher not found");
        }

        return voucher;
    }
    async redeemVoucherTransaction(email: string, code: string){
        const transaction =await this.sequelize.transaction();
        const voucher = await this.validateRedeenVoucher(email, code);
        try{
           voucher.usedAt = new Date();
           voucher.updatedAt = new Date();
           
           await voucher.save()
           transaction.commit()
           return true
        }catch(error){
            await transaction.rollback()
            throw error
        }

    }

    _codeGenerator(){
        return voucher_codes.generate({
            length: 8,
            count: 5
        });
    }
}
