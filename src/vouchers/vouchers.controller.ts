import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateVoucherDto } from './dto/createVoucherDto.dto';
import { VouchersService } from './vouchers.service';
import { RedeemVoucherDTO } from './dto/redeemVoucherDto.dto';

@Controller('vouchers')
export class VouchersController {

    constructor(
        @Inject(VouchersService) private readonly voucherService: VouchersService
    ){}
    @Post()
    async createVoucher(@Body() voucher: CreateVoucherDto){
        try {
            const result = await this.voucherService.create(voucher);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Post("/redeem")
    async redeem(@Body() voucher: RedeemVoucherDTO){
        try {
            const result = await this.voucherService.redeem(voucher.email, voucher.code);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
