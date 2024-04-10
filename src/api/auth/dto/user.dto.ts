import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    contact: string;

    @IsString()
    profile_image_url: string;

    @IsString()
    role: string;

    @IsNotEmpty()
    created_at: Date;

    @IsNotEmpty()
    updated_at: Date;
}
