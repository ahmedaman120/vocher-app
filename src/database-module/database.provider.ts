import { Sequelize } from 'sequelize-typescript';
import { CustomerEntity } from '../customers/entity/customers.entity';
import { ProductEntity } from '../products/entity/product.entity';
import { VoucherEntity } from '../vouchers/entity/voucher.entity';
require('dotenv').config();
const isTest = process.env.NODE_ENV == 'test';
export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: isTest? "sqlite" : 'postgres',
                host: isTest ? undefined : <string>process.env.DB_HOST,
                port: isTest ? undefined : <number><unknown> process.env.DB_PORT,
                username: isTest ? undefined : <string>process.env.DB_USERNAME,
                password: isTest ? undefined : <string>process.env.DB_PASSWORD,
                database: <string>process.env.DB_DATABASE,
            });
            sequelize.addModels([CustomerEntity, ProductEntity, VoucherEntity]);
            await sequelize.sync();
            return sequelize;
        },
    },
];