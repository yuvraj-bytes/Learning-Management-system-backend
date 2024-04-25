import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Course } from "./schema/course.schema";
import { Model } from "mongoose";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { User } from "../users/schema/user.schema";
import { Lesson } from "../lesson/schema/lesson.schema";
import { Enrollment } from "./schema/enrollments.schema";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { MESSAGE } from "src/constants/constants";
import * as cloudinary from 'cloudinary';
import * as dotenv from 'dotenv';
import { ConfigService } from "@nestjs/config";
import { StripeService } from "../auth/ stripe.service";
dotenv.config();
@Injectable()
export class CourseService {

    constructor(@InjectModel(Course.name) private courseModel: Model<Course>,
        @InjectModel(User.name) private readonly userTable: Model<User>,
        @InjectModel(Enrollment.name) private readonly enrollmentTable: Model<Enrollment>,
        @InjectModel(Lesson.name) private readonly lessonTable: Model<Lesson>,
        @InjectModel('Order') private readonly orderTable: Model<any>,
        private readonly configService: ConfigService,
        private readonly stripeService: StripeService) { }

    async createCourse(createCourseDto: CreateCourseDto, file: Express.Multer.File): Promise<any> {

        if (!createCourseDto.title || !createCourseDto.description || !createCourseDto.price) {
            return { status: HttpStatus.BAD_REQUEST, message: MESSAGE.FIELDS_REQUIRED };
        }

        const courseExists = await this.courseModel.findOne({ title: createCourseDto.title });
        if (courseExists) {
            return { status: HttpStatus.BAD_REQUEST, message: MESSAGE.COURSE_ALREADY_EXISTS };
        }

        const course = await this.courseModel.create({ ...createCourseDto });

        await this.uploadImage(course._id, file);

        const product = await this.stripeService.createProduct({
            name: createCourseDto.title
        });

        if (!product) {
            return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: MESSAGE.STRIPE_PRODUCT_CREATION_FAILED };
        }

        const price = await this.stripeService.createPrice({
            currency: 'usd',
            product: product.id,
            unit_amount: createCourseDto.price * 100
        });

        if (!price) {
            return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: MESSAGE.STRIPE_PRICE_CREATION_FAILED };
        }

        await this.courseModel.findByIdAndUpdate(course._id, {
            product_id: product.id,
            price_id: price.id
        });

        return { status: HttpStatus.OK, message: MESSAGE.COURSE_CREATED };
    }

    async getCourseList(userId: string): Promise<any> {
        const userdata = await this.userTable.findOne({ _id: userId });
        const course = await this.courseModel.aggregate([
            {
                '$lookup': {
                    'from': 'enrollments',
                    'let': { 'courseId': '$_id' },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        { '$eq': ['$course_id', '$$courseId'] },
                                        { '$eq': ['$user_id', userdata._id] }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'enroll'
                }
            },
            {
                '$unwind': {
                    'path': '$enroll',
                    'preserveNullAndEmptyArrays': true
                }
            }
        ]);
        if (!course) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND };
        }
        return { status: HttpStatus.OK, message: MESSAGE.COURSE_DATA, data: course };
    }

    async getAllCourse(): Promise<any> {
        const course = await this.courseModel.find();
        if (!course) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND };
        }
        return { status: HttpStatus.OK, message: MESSAGE.COURSE_DATA, data: course };
    }

    async updateCourse(updateCourseDto: UpdateCourseDto): Promise<any> {
        if (!updateCourseDto._id) {
            return { status: HttpStatus.BAD_REQUEST, message: MESSAGE.REQUIRED_COURSE_ID };
        }

        const course = await this.courseModel.findOne({ _id: updateCourseDto._id });
        if (!course) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND };
        }

        const updatedCourse = await this.courseModel.findByIdAndUpdate(course._id, { ...updateCourseDto });
        return { status: HttpStatus.OK, message: MESSAGE.COURSE_UPDATED };
    }

    async deleteCourse(id: string): Promise<any> {
        if (!id) {
            return { status: HttpStatus.BAD_REQUEST, message: MESSAGE.REQUIRED_COURSE_ID };
        }

        const course = await this.courseModel.findOne({ _id: id });
        if (!course) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND }
        }

        await this.courseModel.findByIdAndDelete({ _id: id });
        return { status: HttpStatus.OK, message: MESSAGE.COURSE_DELETED };
    }

    async createEnrollment(createEnrollment: CreateEnrollmentDto, userdata: any): Promise<any> {
        const course = await this.courseModel.findOne({ _id: createEnrollment.course_id });
        const user = await this.userTable.findOne({ _id: userdata.userId });

        if (!user) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.USER_NOT_FOUND };
        }

        const enrollmentExists = await this.enrollmentTable.findOne({
            user_id: userdata.userId,
            course_id: course._id.toString()
        });

        if (enrollmentExists) {
            return { message: 'Course already purchased by this user', statusCode: HttpStatus.BAD_REQUEST };
        }

        if (!course) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND };
        }

        // const enrollStripe = await this.stripeService.createCustomer(user.email);

        const enrollment = await this.enrollmentTable.create({
            user_id: userdata.userId,
            course_id: course._id.toString(),
            lesson_id: createEnrollment.lesson_id,
            transaction_id: '',
            platform: '',
        });

        const Order = await this.orderTable.create({
            user_id: userdata.userId,
            course_id: course._id.toString(),
            transaction_id: '',
            amount: course.price,
            customer_id: '',
            product_id: course.product_id,
            price_id: course.price_id,
            payment_status: '',
            platform: '',
        });

        return { message: MESSAGE.COURSE_ENROLLED, enrollment, statusCode: HttpStatus.OK };
    }

    async leaveCourse(createEnrollment: CreateEnrollmentDto, userdata: any): Promise<any> {
        const lesson = await this.lessonTable.findOne({ _id: createEnrollment.lesson_id });
        const user = await this.userTable.findOne({ _id: userdata.userId });

        if (!lesson) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.LESSON_NOT_FOUND };
        }
        if (!user) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.USER_NOT_FOUND };
        }

        const enrollment = await this.enrollmentTable.findOneAndDelete({
            user_id: userdata.userId,
            course_id: lesson.course_id.toString(),
            lesson_id: lesson._id.toString()
        });

        return enrollment;
    }

    async getsearchCourse(search: string, userId: any): Promise<any> {
        const user = await this.userTable.findOne({ _id: userId.userId });
        const course = await this.courseModel.aggregate([
            {
                '$lookup': {
                    'from': 'enrollments',
                    'let': { 'courseId': '$_id' },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        { '$eq': ['$course_id', '$$courseId'] },
                                        { '$eq': ['$user_id', user._id] }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'enroll'
                }
            },
            {
                '$unwind': {
                    'path': '$enroll',
                    'preserveNullAndEmptyArrays': true
                }
            },
            {
                '$match': {
                    'title': { '$regex': search, '$options': 'i' }
                }
            }
        ]);
        if (!course || course.length === 0) {
            return { status: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND };
        }
        return { status: HttpStatus.OK, message: MESSAGE.COURSE_DATA, data: course };
    }

    async uploadImage(courseId: string, file: Express.Multer.File): Promise<any> {

        cloudinary.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });

        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        // need to upload image in cloudnairy
        const result = await cloudinary.v2.uploader.upload(dataUrl, {
            folder: "course",
        });

        await this.courseModel.findByIdAndUpdate(courseId, { image: result.secure_url });
    }
}
