import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateCourseDto {

    @ApiProperty({
        default: '6638c5798ab49e9ec5e1858a',
    })
    @IsNotEmpty({})
    _id: string;

    @ApiProperty({
        default: 'Course Title',
    })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({
        default: 'Course Description',
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        default: 100,
    })
    @IsOptional()
    price: number;
}
