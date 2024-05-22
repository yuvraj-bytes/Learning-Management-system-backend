import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
    @ApiProperty({
        description: 'Lesson Id',
        example: '60e7c6f5d5c7f3e8d8b0b3e2',
    })
    @IsNotEmpty()
    @IsString()
    lessonId: string;

    @ApiProperty({
        description: 'Question',
        example: 'This is the question',
    })
    @IsNotEmpty()
    @IsString()
    question: string;
}
