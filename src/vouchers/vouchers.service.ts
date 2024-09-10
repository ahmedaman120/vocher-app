import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { VouchersRepo } from './vouchers.repo';
import { CreateVoucherDto } from './dto/createVoucherDto.dto';

@Injectable()
export class VouchersService {
    constructor(@Inject(VouchersRepo) private voucherRepo: VouchersRepo){}
    // create
    async create(voucherDto: CreateVoucherDto){
        try {
            const result=  await this.voucherRepo.createVoucher(voucherDto);
            if(result.length> 0 ){
                return {msg: "Vochers Created", status:201};
            }
            return {msg: "Vocher not Get Created", status: HttpStatus.BAD_REQUEST}
        } catch (error) {
            throw error;
        }
    }
    // redeem update with customer id and make it inactive
    async redeem(email:string, code:string){
        try {
            if(await this.voucherRepo.redeemVoucherTransaction(email,code)){
                return {msg: "Vocher Redeemed", status: HttpStatus.ACCEPTED}
            }
            return {msg: "Vocher not Redeemed", status: HttpStatus.NOT_ACCEPTABLE}
        } catch (error) {
            throw error
        }
    }
}
