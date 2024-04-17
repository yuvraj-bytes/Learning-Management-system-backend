import { IS_ALPHA, IsString } from "class-validator";

export class SignupOutputDto {

    status: number;

    @IsString()
    message: string;

    @IsString()
    data?: any;
}