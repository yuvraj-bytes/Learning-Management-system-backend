import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class ResetPasswordDto {
    @ApiProperty({
        default: 'Test@123',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @IsStrongPassword()
    newPassword: string;
}