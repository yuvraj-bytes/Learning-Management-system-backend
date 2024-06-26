import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CourseService } from "./course.service";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guard/role.guard";
import { GetUser } from "../users/guard/getUser.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
@ApiTags('Course')
@Controller('course')
@Throttle({ default: { limit: 3, ttl: 60000 } })
export class CourseController {

    constructor(private readonly courseService: CourseService) { }
    @Post('create')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', default: 'Node.js' },
                description: { type: 'string', default: 'Node.js Course Description' },
                price: { type: 'string', default: '100' },
                instructor_id: { type: 'string', default: '66290909907062cb4f5c77e7' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })

    @UseInterceptors(FileInterceptor('file'))
    async createCourse(@Body() createCourseDto: CreateCourseDto, @UploadedFile() file: Express.Multer.File): Promise<ResponseDto> {
        return this.courseService.createCourse(createCourseDto, file);
    }

    @Get('getCourseList/:userId')
    @UseGuards(AuthGuard('jwt'))
    async getCourseList(@Param('userId') userId: string): Promise<ResponseDto> {
        return this.courseService.getCourseList(userId);
    }

    @Get('getAllCourse')
    @UseGuards(AuthGuard('jwt'), RolesGuard, ThrottlerGuard)
    async getAllCourse(@Body('search') search: string, @GetUser() userdata: any): Promise<ResponseDto> {
        return this.courseService.getAllCourse(search, userdata);
    }

    @Put('updateCourse')
    async updateCourse(@Body() updateCourseDto: UpdateCourseDto): Promise<ResponseDto> {
        return this.courseService.updateCourse(updateCourseDto);
    }

    @Delete('deleteCourse')
    async deleteCourse(@Body() id: string): Promise<ResponseDto> {
        return this.courseService.deleteCourse(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('enrollment')
    async Enrollments(@Body() createEnrollment: CreateEnrollmentDto, @GetUser() userdata: any): Promise<ResponseDto> {
        return this.courseService.createEnrollment(createEnrollment, userdata);
    }
}