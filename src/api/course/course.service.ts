import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Course } from "./schema/course.schema";
import { Model } from "mongoose";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { User } from "../users/schema/user.schema";
import { Lesson } from "../lesson/schema/lesson.schema";
import { Enrollment } from "./schema/enrollments.schema";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService {

    constructor(@InjectModel(Course.name) private courseModel: Model<Course>,
        @InjectModel(User.name) private readonly userTable: Model<User>,
        @InjectModel(Enrollment.name) private readonly enrollmentTable: Model<Enrollment>,
        @InjectModel(Lesson.name) private readonly lessonTable: Model<Lesson>) { }

    async createCourse(createCourseDto: CreateCourseDto): Promise<string> {

        if (!createCourseDto.title || !createCourseDto.description || !createCourseDto.price) {
            return 'All fields are required';
        }

        const courseExists = await this.courseModel.findOne({ title: createCourseDto.title });
        if (courseExists) {
            return 'Course already exists';
        }

        const course = await this.courseModel.create({ ...createCourseDto });
        return "Course created successfully";
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
            return 'No courses found';
        }
        return course;
    }

    async getAllCourse(): Promise<any> {
        const course = await this.courseModel.find();
        if (!course) {
            return 'No courses found';
        }
        return course;
    }

    async updateCourse(updateCourseDto: UpdateCourseDto): Promise<string> {
        if (!updateCourseDto._id) {
            return 'Course ID is required';
        }

        const course = await this.courseModel.findOne({ _id: updateCourseDto._id });
        if (!course) {
            return 'Course not found';
        }

        const updatedCourse = await this.courseModel.findByIdAndUpdate(course._id, { ...updateCourseDto });
        return 'Course updated successfully';
    }

    async deleteCourse(id: string): Promise<string> {
        if (!id) {
            return 'Course ID is required';
        }

        const course = await this.courseModel.findOne({ _id: id });
        if (!course) {
            return 'Course not found';
        }

        await this.courseModel.findByIdAndDelete({ _id: id });
        return 'Course deleted successfully';
    }

    async createEnrollment(createEnrollment: CreateEnrollmentDto, userdata: any): Promise<{ enrollment?: any, statusCode: number, message?: any }> {
        const course = await this.courseModel.findOne({ _id: createEnrollment.course_id });
        const user = await this.userTable.findOne({ _id: userdata.userId });

        if (!user) {
            return { message: 'User not found', statusCode: 404 };
        }

        const enrollmentExists = await this.enrollmentTable.findOne({
            user_id: userdata.userId,
            course_id: course._id.toString()
        });

        if (enrollmentExists) {
            return { message: 'Course already purchased by this user', statusCode: 400 };
        }

        const enrollment = await this.enrollmentTable.create({
            user_id: userdata.userId,
            course_id: course._id.toString()
        });

        return { message: 'You have enroll a course successfully', enrollment, statusCode: 200 };
    }

    async leaveCourse(createEnrollment: CreateEnrollmentDto, userdata: any): Promise<any> {
        const lesson = await this.lessonTable.findOne({ _id: createEnrollment.lesson_id });
        const user = await this.userTable.findOne({ _id: userdata.userId });

        if (!lesson) {
            return 'Lesson not found';
        }
        if (!user) {
            return 'User not found';
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
            return 'No courses found';
        }

        return course;
    }
}
