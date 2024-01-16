import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/TaskCreate.dto';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService){ }

    @Get(':id')
    getTaskById( @Param('id', ParseIntPipe) id: number) {
      return this.taskService.getTaskById(id);
    }

    @Get('')
    getAllTask() {
      return this.taskService.getTasks();
    }

    @Post('')
    createTask(@Body() createTaskDto: CreateTaskDto){
        return this.taskService.saveTask(createTaskDto);
    }
}
