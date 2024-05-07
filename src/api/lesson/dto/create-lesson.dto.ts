import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
export class CreateLessonDto {
    @ApiProperty({
        default: 'Lesson 1'
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        default: 'Lesson Content'
    })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({
        default: '6638c5798ab49e9ec5e1858a'
    })
    @IsNotEmpty()
    @IsString()
    course_id: string;
}