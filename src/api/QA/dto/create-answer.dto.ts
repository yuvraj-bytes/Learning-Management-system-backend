import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
    @ApiProperty({
        description: 'Question Id',
        example: '60e7c6f5d5c7f3e8d8b0b3e2',
    })
    @IsNotEmpty()
    @IsString()
    questionId: string;

    @ApiProperty({
        description: 'Answer',
        example: 'This is the answer',
    })
    @IsNotEmpty()
    @IsString()
    answer: string;
}
