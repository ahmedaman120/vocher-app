import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModuleModule } from './database-module/database-module.module';
import { CustomersModule } from './customers/customers.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { ProductsModule } from './products/products.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    DatabaseModuleModule, 
    CustomersModule, 
    VouchersModule, 
    ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
