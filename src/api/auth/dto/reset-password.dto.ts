import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @IsStrongPassword()
    newPassword: string;
}