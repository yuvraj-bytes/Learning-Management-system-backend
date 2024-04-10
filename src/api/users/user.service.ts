import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "./schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { hash } from "bcrypt";
import { Enrollment } from "../course/schema/enrollments.schema";

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>) { }

    async getUsers() {
        const users = this.userModel.find();
        if (!users) {
            return { message: 'No users found' };
        }
        else {
            return users;
        }
    }

    async getUserById(id: string) {
        const user = this.userModel.findById(id);
        if (!user) {
            return { message: 'User not found' };
        }
        else {
            return user;
        }
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const { password, ...rest } = updateUserDto;
        const hashedPassword = await hash(password, 10);
        const user = await this.userModel.findByIdAndUpdate(id, { ...rest, password: hashedPassword });
        if (!user) {
            return { message: 'User not found' };
        } else {
            return { message: 'User updated', user };
        }
    }

    async deleteUser(id: string) {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user) {
            return { message: 'User not found' };
        } else {
            return { message: 'User deleted' };
        }
    }

    async getMe(id: string, course_id: string, userData: any) {
        const users = await this.userModel.findById({ _id: userData.userId });
        const enrolledCourses = await this.enrollmentModel.find({ user_id: id, course_id: course_id });
        return {
            statusCode: 200,
            message: 'User found',
            isEnrolled: (enrolledCourses.length > 0 ? true : false),
            user: users
        }
    }
}
