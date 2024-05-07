import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
    @ApiProperty({
        default: 'jhon@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}