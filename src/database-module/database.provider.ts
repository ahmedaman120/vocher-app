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
                host: isTest ? undefined : 'localhost',
                port: isTest ? undefined :  3306,
                username: isTest ? undefined : 'root',
                password: isTest ? undefined : 'password',
                database: process.env.DB,
            });
            sequelize.addModels([CustomerEntity, ProductEntity, VoucherEntity]);
            await sequelize.sync();
            return sequelize;
        },
    },
];