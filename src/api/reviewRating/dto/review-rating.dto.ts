import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class ReviewRatingDto {
    @ApiProperty({
        description: 'Course ID',
        example: '60f4b1e0b9f1c3f0c4c8d4f1'
    })
    @IsNotEmpty()
    courseId: string;

    @ApiProperty({
        description: 'User ID',
        example: '60f4b1e0b9f1c3f0c4c8d4f1'
    })
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'Review',
        example: 'This course is awesome!'
    })
    @IsNotEmpty()
    review: string;

    @ApiProperty({
        description: 'Rating',
        example: 5
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;
}
