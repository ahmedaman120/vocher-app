import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString, Max, Min } from "class-validator";

export class CreateProductRequestDto{
    @ApiProperty()
    @IsString()
    declare name: string;


    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @Min(0.1, { message: 'Percentage must be a non-negative number' })
    @Max(99.99, { message: 'Percentage must be not above 100' })
    declare percentage: number;
}