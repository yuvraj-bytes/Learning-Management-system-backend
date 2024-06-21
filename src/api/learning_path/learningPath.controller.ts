import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Learning Path')
@Controller('learning-path')
export class LearningPathController {
    constructor() { }

    
}