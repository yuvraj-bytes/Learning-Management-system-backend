import { IS_ALPHA, IsNumber, IsString } from "class-validator";

export class UserOutputDto {

    @IsNumber()
    status: number;

    @IsString()
    message: string;

    @IsString()
    data?: any;
}