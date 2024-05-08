import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
    @ApiProperty({
        default: 'Notification title',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        default: 'Notification content',
    })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({
        default: 'info',
    })
    @IsOptional()
    @IsString()
    @IsIn(['info', 'warning', 'error'])
    type?: 'info' | 'warning' | 'error';
}
