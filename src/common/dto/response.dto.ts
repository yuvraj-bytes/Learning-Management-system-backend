import { IsNumber, IsString } from "class-validator";

export class ResponseDto {

    @IsNumber()
    statusCode: number;

    @IsString()
    message: string;

    @IsString()
    data?: any;
}