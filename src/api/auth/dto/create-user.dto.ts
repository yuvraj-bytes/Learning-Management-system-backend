import { IsNotEmpty, IsString, IsEmail, Length, IsStrongPassword } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class CreateUserDto {
    @ApiProperty({
        default: 'John',
    })
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty({
        default: 'Doe',
    })
    @IsNotEmpty()
    last_name: string;

    @ApiProperty({
        default: 'jhon@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        default: 'Test@123',
    })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    @Length(6, 50, {
        message: 'Password length Must be minimum 6 characters',
    })
    password: string;

    @ApiProperty({
        default: '1234567890',
    })
    @IsString()
    contact: string;

    @ApiProperty({
        default: 'admin',
    })
    @IsNotEmpty()
    @IsString()
    role: string;
}


