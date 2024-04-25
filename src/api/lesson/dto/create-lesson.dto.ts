import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateLessonDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    course_id: string;

    // @IsNotEmpty()
    // @IsString()
    // video_url: string;

    @IsBoolean()
    completed: boolean;

    // @IsString()
    // thumbnail: string;

    @IsNotEmpty()
    @IsString()
    created_at: Date;

    @IsNotEmpty()
    @IsString()
    updated_at: Date;
}