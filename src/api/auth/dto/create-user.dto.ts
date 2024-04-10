import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

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
    password: string;

    @IsString()
    contact: string;

    @IsString()
    profile_image_url: string;

    @IsNotEmpty()
    @IsString()
    role: string;

    @IsNotEmpty()
    created_at: Date;

    @IsNotEmpty()
    updated_at: Date;
}
