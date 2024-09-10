import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { CustomerEntity } from "../../customers/entity/customers.entity";
import { VoucherEntity } from "../../vouchers/entity/voucher.entity";



@Table({
    tableName:"products",
    timestamps: true,
    modelName: "Product",
    paranoid: true,
})
export class ProductEntity extends Model<ProductEntity>{
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

   
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string

    @Column({
        type: DataType.DOUBLE(4, 2)
    })
    declare percentage: number;


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


   @HasMany(()=>VoucherEntity, "productId")
   declare vouchers: VoucherEntity[]

}