import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateCourseDto {

    _id: string;

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
