import { HttpStatus, Injectable, Search } from "@nestjs/common";
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
import { ConfigService } from "@nestjs/config";
import { StripeService } from "../stripe/ stripe.service";
import { ResponseDto } from "src/common/dto/response.dto";
import { Order } from "./schema/order.schema";
import { UploadImageService } from "src/utills/upload-image";
@Injectable()
export class CourseService {

    constructor(@InjectModel(Course.name) private courseModel: Model<Course>,
        @InjectModel(User.name) private readonly userTable: Model<User>,
        @InjectModel(Enrollment.name) private readonly enrollmentTable: Model<Enrollment>,
        @InjectModel(Lesson.name) private readonly lessonTable: Model<Lesson>,
        @InjectModel(Order.name) private readonly orderTable: Model<any>,
        private readonly configService: ConfigService,
        private readonly stripeService: StripeService,
        private readonly uploadImageService: UploadImageService) { }

    async createCourse(createCourseDto: CreateCourseDto, file: any): Promise<ResponseDto> {

        const courseExists = await this.courseModel.findOne({ title: createCourseDto.title });
        if (courseExists) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.COURSE_ALREADY_EXISTS };
        }

        const course = await this.courseModel.create({
            title: createCourseDto.title,
            description: createCourseDto.description,
            price: createCourseDto.price,
            instructor_id: createCourseDto.instructor_id,
            image: '',
            product_id: '',
            price_id: ''
        });

        await this.uploadImageService.uploadImage(course._id, file);

        const product = await this.stripeService.createProduct({
            name: createCourseDto.title
        });

        if (!product) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: MESSAGE.STRIPE_PRODUCT_CREATION_FAILED };
        }

        const price = await this.stripeService.createPrice({
            currency: 'usd',
            product: product.id,
            unit_amount: createCourseDto.price * 100
        });

        if (!price) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: MESSAGE.STRIPE_PRICE_CREATION_FAILED };
        }

        course.product_id = product.id;
        course.price_id = price.id;

        await course.save();
        return { statusCode: HttpStatus.OK, message: MESSAGE.COURSE_CREATED };
    }

    async getCourseList(userId: string): Promise<ResponseDto> {
        const userdata = await this.userTable.findOne({ _id: userId });

        if (!userdata) {
            return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.USER_NOT_FOUND };
        }

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

        return { statusCode: HttpStatus.OK, message: MESSAGE.COURSE_DATA, data: course };
    }

    async getAllCourse(search: string, userId: any): Promise<ResponseDto> {

        if (userId && search) {
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
            return { statusCode: HttpStatus.OK, message: MESSAGE.COURSE_DATA, data: course };
        }
        const course = await this.courseModel.find();
        return { statusCode: HttpStatus.OK, message: MESSAGE.COURSE_DATA, data: course };
    }

    async updateCourse(updateCourseDto: UpdateCourseDto): Promise<ResponseDto> {

        const course = await this.courseModel.findOne({ _id: updateCourseDto._id });
        if (!course) {
            return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND };
        }

        const updatedCourse = await this.courseModel.findByIdAndUpdate(course._id, { ...updateCourseDto });
        return { statusCode: HttpStatus.OK, message: MESSAGE.COURSE_UPDATED, data: updatedCourse };
    }

    async deleteCourse(id: string): Promise<ResponseDto> {
        if (!id) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.REQUIRED_COURSE_ID };
        }

        const course = await this.courseModel.findOne({ _id: id });
        if (!course) {
            return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND }
        }

        await this.courseModel.findByIdAndDelete({ _id: id });
        return { statusCode: HttpStatus.OK, message: MESSAGE.COURSE_DELETED };
    }

    async createEnrollment(createEnrollment: CreateEnrollmentDto, userdata: any): Promise<ResponseDto> {
        const course = await this.courseModel.findOne({ _id: createEnrollment.course_id });
        const user = await this.userTable.findOne({ _id: userdata.userId });

        if (!user) {
            return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.USER_NOT_FOUND };
        }

        const enrollmentExists = await this.enrollmentTable.findOne({
            user_id: userdata.userId,
            course_id: course._id.toString()
        });

        if (enrollmentExists) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: MESSAGE.COURSE_ALREADY_PURCHASED };
        }

        if (!course) {
            return { statusCode: HttpStatus.NOT_FOUND, message: MESSAGE.COURSE_NOT_FOUND };
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

        return { statusCode: HttpStatus.OK, message: MESSAGE.COURSE_PURCHASED, data: { Order, enrollment } };
    }

}
