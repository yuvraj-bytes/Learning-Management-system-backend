import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @IsStrongPassword()
    newPassword: string;
}