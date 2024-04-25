import { IS_ALPHA, IsString } from "class-validator";

export class LessonOutputDto {

    status: number;

    @IsString()
    message: string;

    @IsString()
    data?: any;
}