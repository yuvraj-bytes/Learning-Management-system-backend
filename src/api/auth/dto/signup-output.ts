import { IsNumber, IsString } from "class-validator";

export class SignupOutputDto {

    @IsNumber()
    status: number;

    @IsString()
    message: string;

    @IsString()
    data?: any;
}