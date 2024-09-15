import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { VouchersRepo } from './vouchers.repo';
import { CreateVoucherDto } from './dto/createVoucherDto.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class VouchersService {
  constructor(
    @Inject(VouchersRepo) private voucherRepo: VouchersRepo,
    @InjectMetric('voucher_requests_total')
    private readonly voucherRequestsCounter: Counter<string>,
    @InjectMetric('voucher_request_duration_seconds')
    private readonly voucherRequestDurationHistogram: Histogram<string>,
  ) {}

  // create
  async create(voucherDto: CreateVoucherDto) {
    try {
      const result = await this.voucherRepo.createVoucher(voucherDto);
      if (result.length > 0) {
        return { msg: 'Vochers Created', status: 201 };
      }
      return { msg: 'Vocher not Get Created', status: HttpStatus.BAD_REQUEST };
    } catch (error) {
      throw error;
    }
  }
  // redeem update with customer id and make it inactive
  async redeem(email: string, code: string) {
    const startTime = Date.now();
    try {
      if (await this.voucherRepo.redeemVoucherTransaction(email, code)) {
        this.handleVoucherSuccess();
        const durationInSeconds = (Date.now() - startTime) / 1000;
        this.trackVoucherDuration(durationInSeconds, 'success');
        return { msg: 'Vocher Redeemed', status: HttpStatus.ACCEPTED };
      }
      this.handleVoucherError();
      const durationInSeconds = (Date.now() - startTime) / 1000;
      this.trackVoucherDuration(durationInSeconds, <string>'faild');
      return { msg: 'Vocher not Redeemed', status: HttpStatus.NOT_ACCEPTABLE };
    } catch (error) {
      const durationInSeconds = (Date.now() - startTime) / 1000;
      this.handleVoucherError();
      this.trackVoucherDuration(durationInSeconds, 'error');
      throw error;
    }
  }
  handleVoucherSuccess() {
    this.voucherRequestsCounter.inc({ status: 'success' });
  }

  handleVoucherError() {
    this.voucherRequestsCounter.inc({ status: 'error' });
  }

  trackVoucherDuration(durationInSeconds: number, status: string) {
    this.voucherRequestDurationHistogram.observe({ status }, durationInSeconds);
  }
}
