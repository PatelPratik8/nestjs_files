import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    ScheduleModule.forRoot()
  ],
})
export class TaskModule {}
