import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guard/role.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { ROLES } from "src/enum/role.enum";
import { GetUser } from "./guard/getUser.guard";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(ROLES.ADMIN)
    @Get('getAllUsers')
    async getUsers() {
        return this.userService.getUsers();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(ROLES.ADMIN)
    @Get('getUserById')
    async getUserById(@Body('id') id: string) {
        return this.userService.getUserById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(ROLES.ADMIN)
    @Put('updateUser/:id')
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Body('id') id: string) {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete('deleteUser/:id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Get('me/:id/:course_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async getMe(@Param('id') id: string, @Param('course_id') course_id: string, @GetUser() userdata: any) {
        return this.userService.getMe(id, course_id, userdata);
    }
}
