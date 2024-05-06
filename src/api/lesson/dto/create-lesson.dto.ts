import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
export class CreateLessonDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    course_id: string;
}