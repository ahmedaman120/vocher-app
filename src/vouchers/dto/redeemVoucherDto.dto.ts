import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty} from "class-validator";

export class RedeemVoucherDTO{
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string
}