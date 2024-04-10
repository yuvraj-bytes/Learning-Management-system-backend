import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    instructor_id: string;

    @IsNotEmpty()
    @IsString()
    created_at: Date;

    @IsNotEmpty()
    @IsString()
    updated_at: Date;
}