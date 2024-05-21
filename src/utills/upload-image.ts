import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from '../common/dto/response.dto';
import { MESSAGE } from '../constants/constants';
import { Course } from '../api/course/schema/course.schema';
import * as cloudinary from 'cloudinary';
@Injectable()
export class UploadImageService {
    constructor(
        private readonly configService: ConfigService,
        @InjectModel('Course') private readonly courseModel: Model<Course>,
    ) {
        cloudinary.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(courseId: string, file: Express.Multer.File): Promise<ResponseDto> {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.v2.uploader.upload(dataUrl, {
            folder: 'course',
        });

        await this.courseModel.findByIdAndUpdate(courseId, { image: result.secure_url });

        return { statusCode: HttpStatus.OK, message: MESSAGE.IMAGE_UPLOAD_SUCCESS };
    }
}