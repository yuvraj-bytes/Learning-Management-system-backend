import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export enum NotificationType {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
}
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
    @IsIn([NotificationType.INFO, NotificationType.WARNING, NotificationType.ERROR])
    type: NotificationType;
}
