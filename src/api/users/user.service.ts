import { HttpStatus, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "./schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { hash } from "bcrypt";
import { Enrollment } from "../course/schema/enrollments.schema";
import { UserOutputDto } from "./dto/users-output-dto";
import { USERS_DATA, USER_DELETED, USER_DETAILS_UPDATED, USER_NOT_FOUND } from "src/constants/constants";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>) { }


    async getUsers(): Promise<UserOutputDto | User> {
        const users = await this.userModel.find().exec();
        if (!users) {
            return { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
        }
        else {
            return { status: HttpStatus.OK, message: USERS_DATA, data: users };
        }
    }

    async getUserById(id: string): Promise<UserOutputDto> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            return { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
        }
        else {
            return { status: HttpStatus.OK, message: USERS_DATA, data: user };
        }
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserOutputDto> {
        const { password, ...rest } = updateUserDto;
        const hashedPassword = await hash(password, 10);
        const user = await this.userModel.findByIdAndUpdate(id, { ...rest, password: hashedPassword });
        if (!user) {
            return { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
        } else {
            return { status: HttpStatus.OK, message: USER_DETAILS_UPDATED, data: user };
        }
    }

    async deleteUser(id: string): Promise<UserOutputDto> {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user) {
            return { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };
        } else {
            return { status: HttpStatus.OK, message: USER_DELETED };
        }
    }

    async getMe(id: string, course_id: string, userData: any) {
        const users = await this.userModel.findById({ _id: userData.userId });
        const enrolledCourses = await this.enrollmentModel.find({ user_id: id, course_id: course_id });
        return {
            status: HttpStatus.OK,
            message: USERS_DATA,
            isEnrolled: (enrolledCourses.length > 0 ? true : false),
            user: users
        }
    }
}
