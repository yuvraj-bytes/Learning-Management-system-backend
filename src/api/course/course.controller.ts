import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CourseService } from "./course.service";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guard/role.guard";
import { GetUser } from "../users/guard/getUser.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('course')
export class CourseController {

    constructor(private readonly courseService: CourseService) { }

    @Post('create')
    async createCourse(@Body() createCourseDto: CreateCourseDto): Promise<String> {
        return this.courseService.createCourse(createCourseDto);
    }

    @Get('getCourseList/:userId')
    @UseGuards(AuthGuard('jwt'))
    async getCourseList(@Param('userId') userId: string) {
        return this.courseService.getCourseList(userId);
    }

    @Get('getAllCourse')
    async getAllCourse() {
        return this.courseService.getAllCourse();
    }

    @Put('updateCourse')
    async updateCourse(@Body() updateCourseDto: UpdateCourseDto): Promise<String> {
        return this.courseService.updateCourse(updateCourseDto);
    }

    @Delete('deleteCourse')
    async deleteCourse(@Body() id: string): Promise<String> {
        return this.courseService.deleteCourse(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('enrollment')
    async Enrollments(@Body() createEnrollment: CreateEnrollmentDto, @GetUser() userdata: any): Promise<any> {
        return this.courseService.createEnrollment(createEnrollment, userdata);
    }

    @Post('leaveCourse')
    async leaveCourse(@Body() createEnrollment: CreateEnrollmentDto, @GetUser() userdata: any): Promise<any> {
        return this.courseService.leaveCourse(createEnrollment, userdata);
    }

    @Get('getSearchCourse/:search')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async getsearchCourse(@Param('search') search: string, @GetUser() userdata: any) {
        return this.courseService.getsearchCourse(search, userdata);
    }

    @Post('upload/:courseId')

    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Param('courseId') courseId: string) {
        await this.courseService.uploadImage(courseId, file);
        return { message: 'Image uploaded successfully' };
    }
}   