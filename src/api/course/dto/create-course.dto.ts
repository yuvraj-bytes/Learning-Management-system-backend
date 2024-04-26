import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    @IsString()
    instructor_id: string;

}