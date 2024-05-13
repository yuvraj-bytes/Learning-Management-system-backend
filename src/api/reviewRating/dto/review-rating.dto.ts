import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class ReviewRatingDto {
    @IsNotEmpty()
    courseId: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    review: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;
}
