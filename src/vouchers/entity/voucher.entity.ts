import { PrimaryKey, Table, Model, DataType, Column, Index, CreatedAt, UpdatedAt, HasMany, BelongsTo, BelongsToMany } from "sequelize-typescript";
import { CustomerEntity } from "../../customers/entity/customers.entity";
import { ProductEntity } from "../../products/entity/product.entity";


@Table({
    tableName:"vouchers",
    timestamps: true,
    modelName: "Voucher",
    paranoid: true,
})
export class VoucherEntity extends Model<VoucherEntity>{

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
    declare code: string

    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    declare customerId: string

    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare productId: string

    @CreatedAt
    @Column
    declare createdAt: Date;

    @UpdatedAt
    @Column
    declare updatedAt: Date;


    @Column({
        type: DataType.DATE
    })
    declare deletedAt: Date | null;

    @Column({
        type: DataType.DATE
    })
    declare usedAt: Date | null;

    @Column({
        type: DataType.DATE
    })
    declare expriyDate: Date | null;

  @BelongsTo(()=>CustomerEntity,"customerId")
  declare customer: CustomerEntity;

  @BelongsTo(()=>ProductEntity, "productId")
  declare product: ProductEntity;

}