import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 50, {
        message: 'Password length Must be minimum 6 characters',
    })
    password: string;

    @IsString()
    contact: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}
