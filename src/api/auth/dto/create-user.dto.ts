import { IsNotEmpty, IsString, IsEmail, Length, IsStrongPassword } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    last_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    @Length(6, 50, {
        message: 'Password length Must be minimum 6 characters',
    })
    password: string;

    @ApiProperty()
    @IsString()
    contact: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    role: string;
}


