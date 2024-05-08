import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

export class QueryNotificationDto {
    @ApiProperty({
        default: 'info',
    })
    @IsOptional()
    @IsIn(['info', 'warning', 'error'])
    type?: 'info' | 'warning' | 'error';
}
