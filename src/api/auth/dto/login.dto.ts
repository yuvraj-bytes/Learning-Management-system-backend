import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        default: 'jhon@gmail.com'
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        default: 'Test@123',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}