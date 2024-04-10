import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateEnrollmentDto {

    @IsNotEmpty()
    @IsString()
    course_id: string;

    @IsNotEmpty()
    @IsString()
    lesson_id?: string;

    @IsNotEmpty()
    @IsBoolean()
    completed: boolean;

    @IsNotEmpty()
    enrolled_at: Date;
}