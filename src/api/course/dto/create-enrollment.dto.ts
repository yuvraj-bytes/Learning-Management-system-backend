import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateEnrollmentDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    course_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lesson_id?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    completed: boolean;

    @ApiProperty()
    @IsNotEmpty()
    enrolled_at: Date;
}