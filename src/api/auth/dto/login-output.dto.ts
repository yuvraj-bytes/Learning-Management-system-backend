import { IS_ALPHA, IsString } from "class-validator";

export class LoginOutputDto {

    status: number;

    @IsString()
    message: string;

    @IsString()
    token?: string;

    @IsString()
    data?: any;
}