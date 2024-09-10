import { PrimaryKey, Table, Model, DataType, Column, Index, CreatedAt, UpdatedAt, HasMany } from "sequelize-typescript";
import { VoucherEntity } from "../../vouchers/entity/voucher.entity";
import { CreateCustomerDTO } from "../dto/create-customer.request.dto";


@Table({
    tableName:"customers",
    timestamps: true,
    modelName: "Customer",
    paranoid: true,
})
export class CustomerEntity extends Model<CustomerEntity>{

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    declare id: string;

    @Column({ type: DataType.STRING(255) })
    declare username: string;


    @Column({ type: DataType.STRING(255)})
    @Index({ unique: true })
    declare email: string;


    @CreatedAt
    @Column
    declare createdAt: Date;

    @UpdatedAt
    @Column
    declare updatedAt: Date;

    @Column({ type: DataType.DATE })
    declare lastVoucherUse: Date;

    @Column({
        type: DataType.DATE
    })
    declare deletedAt: Date | null;


    @HasMany(() => VoucherEntity, 'customerId')
    declare vouchers: VoucherEntity[];

}