import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCourseDto {

    @IsNotEmpty()
    _id: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    price: number;
}
