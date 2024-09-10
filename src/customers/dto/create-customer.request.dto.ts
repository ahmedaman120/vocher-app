import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class CreateCustomerDTO{ 
   
    @ApiProperty({
        example: "test"
    })
    @IsString()
    @IsNotEmpty()
    declare username: string;


    @ApiProperty({
        example: "test@g.com"
    })
    @IsEmail()
    @IsNotEmpty()
    declare email: string;
}