import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/schema/user.schema";
import * as bcrypt from 'bcrypt';
import { LoginOutputDto } from "./dto/login-output.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService) { }

    async signup(createUserDto: UserDto): Promise<User | String> {

        const { email, password, ...rest } = createUserDto;
        if (!createUserDto.first_name || !createUserDto.email || !createUserDto.password) {
            return 'All fields are required';
        }

        const existingUser = await this.userModel.findOne({ email });

        if (existingUser) {
            return 'User already exists';
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const createdUser = new this.userModel({ ...rest, email, password: hashedPassword });
        return createdUser.save();
    }

    async signIn(email: string, password: string): Promise<LoginOutputDto> {
        const user = await this.userModel.findOne({ email });

        if (!user) {
            return { status: 404, message: 'User not found' };
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = await this.jwtService.signAsync({ id: user.id, email: user.email, role: user.role, username: user.first_name });
                return { status: 200, message: 'Login successful', token, data: user };
            } else {
                return { status: 400, message: 'Invalid credentials' };
            }
        }
    }
}
