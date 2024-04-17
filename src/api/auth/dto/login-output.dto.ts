import { IsNumber, IsString } from "class-validator";

export class LoginOutputDto {

    @IsNumber()
    status: number;

    @IsString()
    message: string;

    @IsString()
    token?: string;

    @IsString()
    data?: any;
}