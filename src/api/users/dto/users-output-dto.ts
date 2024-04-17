import { IS_ALPHA, IsString } from "class-validator";

export class UserOutputDto {

    status: number;

    @IsString()
    message: string;

    @IsString()
    data?: any;
}