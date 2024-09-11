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
        @InjectModel(CustomerEntity) private customerModel: typeof CustomerEntity,
        @InjectModel(ProductEntity) private productEntity: typeof ProductEntity,
        @Inject("SEQUELIZE") private sequelize: Sequelize
    ) { }

    async createVoucher(voucherDTO: CreateVoucherDto): Promise<VoucherEntity[] | null> {
        try {
            this._vaidateVocher(voucherDTO)
            const customers = await this.customerModel.findAll();
            const customersVouchers = customers.map((value) => {
                console.log(value.id)
                return {
                    ...voucherDTO,
                    code: this._codeGenerator(),
                    customerId: value.id,
                }
            })
            console.log(customersVouchers)
            return await this.voucherModel.bulkCreate(customersVouchers);
        } catch (error) {
            console.log("error", error)
            throw error

        }
    }
    _vaidateVocher(voucherDTO: CreateVoucherDto) {
        if (voucherDTO.expriyDate < new Date()) {
            throw new Error("Date should be in the future");
        }
    }

    async redeemVoucherTransaction(email: string, code: string) {
        const transaction = await this.sequelize.transaction();
        try {
            const voucher = await this.validateRedeenVoucher(email, code);
            const now = new Date();
            voucher.usedAt = now;
            voucher.updatedAt = now;

            await voucher.save()
            const product = await this.productEntity.findOne({ where: { id: voucher.productId } });
            await this.productEntity.update({
                lastVoucherUse: now,
                numOfRedeem: product.numOfRedeem + 1
            }, {
                where: {
                    id: voucher.productId
                }
            })
            transaction.commit()
            return true
        } catch (error) {
            await transaction.rollback()
            throw error
        }
        
    }
    async validateRedeenVoucher(email: string, code: string) {
        const customer =await this.customerModel.findOne({ where: { email } })
        if (!customer) {
            throw new Error("Customer not found");
        }

        const voucher = await this.voucherModel.findOne({
            where: {
                code,
                usedAt: null
            }
        })
        if (!voucher) {
            throw new Error("Voucher not found");
        }
        if (this.getExpiryDate(voucher) < new Date()) {
            throw new Error("Vocher is expired")
        }



        return voucher;
    }

    getExpiryDate(voucher: VoucherEntity){
        return voucher.expriyDate;
    }
    _codeGenerator() {
        return voucher_codes.generate({
            length: 8,
            count: 1
        });
    }
}
