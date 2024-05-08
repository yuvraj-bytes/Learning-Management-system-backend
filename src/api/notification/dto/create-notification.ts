import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateNotificationDto {
    @ApiProperty({
        default: 'Notification title',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        default: 'Notification content',
    })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({
        default: 'info',
    })
    @IsNotEmpty()
    @IsIn(['info', 'warning', 'error'])
    type: string;
}
