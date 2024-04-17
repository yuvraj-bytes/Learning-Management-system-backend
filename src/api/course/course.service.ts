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
import { COURSE_ALREADY_EXISTS, COURSE_CREATED, COURSE_DATA, COURSE_DELETED, COURSE_ENROLLED, COURSE_NOT_FOUND, COURSE_UPDATED, FIELDS_REQUIRED, LESSON_NOT_FOUND, REQUIRED_COURSE_ID, USER_NOT_FOUND } from "src/constants/constants";
import { extname } from "path";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class CourseService {

    constructor(@InjectModel(Course.name) private courseModel: Model<Course>,
        @InjectModel(User.name) private readonly userTable: Model<User>,
        @InjectModel(Enrollment.name) private readonly enrollmentTable: Model<Enrollment>,
        @InjectModel(Lesson.name) private readonly lessonTable: Model<Lesson>) { }

    async createCourse(createCourseDto: CreateCourseDto): Promise<any> {

        if (!createCourseDto.title || !createCourseDto.description || !createCourseDto.price) {
            return { status: HttpStatus.BAD_REQUEST, message: FIELDS_REQUIRED };
        }

        const courseExists = await this.courseModel.findOne({ title: createCourseDto.title });
        if (courseExists) {
            return { status: HttpStatus.BAD_REQUEST, message: COURSE_ALREADY_EXISTS };
        }

        const course = await this.courseModel.create({ ...createCourseDto });
        return { status: HttpStatus.OK, message: COURSE_CREATED };
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
            return { status: HttpStatus.NOT_FOUND, message: COURSE_NOT_FOUND };
        }
        return { status: HttpStatus.OK, message: COURSE_DATA, data: course };
    }

    async getAllCourse(): Promise<any> {
        const course = await this.courseModel.find();
        if (!course) {
            return { status: HttpStatus.NOT_FOUND, message: COURSE_NOT_FOUND };
        }
        return { status: HttpStatus.OK, message: COURSE_DATA, data: course };
    }

    async updateCourse(updateCourseDto: UpdateCourseDto): Promise<any> {
        if (!updateCourseDto._id) {
            return { status: HttpStatus.BAD_REQUEST, message: REQUIRED_COURSE_ID };
        }

        const course = await this.courseModel.findOne({ _id: updateCourseDto._id });
        if (!course) {
            return { status: HttpStatus.NOT_FOUND, message: COURSE_NOT_FOUND };
        }

        const updatedCourse = await this.courseModel.findByIdAndUpdate(course._id, { ...updateCourseDto });
        return { status: HttpStatus.OK, message: COURSE_UPDATED };
    }

    async deleteCourse(id: string): Promise<any> {
        if (!id) {
            return { status: HttpStatus.BAD_REQUEST, message: REQUIRED_COURSE_ID };
        }

        const course = await this.courseModel.findOne({ _id: id });
        if (!course) {
            return { status: HttpStatus.NOT_FOUND, message: COURSE_NOT_FOUND }
        }

        await this.courseModel.findByIdAndDelete({ _id: id });
        return { status: HttpStatus.OK, message: COURSE_DELETED };
    }

    async createEnrollment(createEnrollment: CreateEnrollmentDto, userdata: any): Promise<any> {
        const course = await this.courseModel.findOne({ _id: createEnrollment.course_id });
        const user = await this.userTable.findOne({ _id: userdata.userId });

        if (!user) {
            return { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
        }

        const enrollmentExists = await this.enrollmentTable.findOne({
            user_id: userdata.userId,
            course_id: course._id.toString()
        });

        if (enrollmentExists) {
            return { message: 'Course already purchased by this user', statusCode: HttpStatus.BAD_REQUEST };
        }

        const enrollment = await this.enrollmentTable.create({
            user_id: userdata.userId,
            course_id: course._id.toString()
        });

        return { message: COURSE_ENROLLED, enrollment, statusCode: HttpStatus.OK };
    }

    async leaveCourse(createEnrollment: CreateEnrollmentDto, userdata: any): Promise<any> {
        const lesson = await this.lessonTable.findOne({ _id: createEnrollment.lesson_id });
        const user = await this.userTable.findOne({ _id: userdata.userId });

        if (!lesson) {
            return { status: HttpStatus.NOT_FOUND, message: LESSON_NOT_FOUND };
        }
        if (!user) {
            return { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
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
            return { status: HttpStatus.NOT_FOUND, message: COURSE_NOT_FOUND };
        }
        return { status: HttpStatus.OK, message: COURSE_DATA, data: course };
    }

    async uploadImage(courseId: string, file: Express.Multer.File): Promise<string> {
        const fileExtName = extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtName}`;
        const filePath = `/media/bytes-pallavi/workspace/projects/demo/NestJS/LMS/lms/uploads/${fileName}`;
        await fs.promises.writeFile(filePath, file.buffer);
        await this.courseModel.findByIdAndUpdate(courseId, { image: filePath });
        return filePath;
    }
}
