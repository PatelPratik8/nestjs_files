import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: DatabaseService) {}

  async getTaskById(id) {
    return this.prisma.task.findMany({ where: { id } });
  }

  async getTasks() {
    return this.prisma.task.findMany();
  }
  async saveTask(createTaskDto) {
    return this.prisma.task.create({ data: createTaskDto });
  }

  @Cron('0 * * * * *')
  async handleCron() {

    const taskList = await this.prisma.task.findMany({
      where: {
        start_on: { lte: new Date() },
        status: 'PENDING',
        fileId: { gt: 0 },
      },
    });

    Promise.all(
      taskList.map(async (e) => {
        if (!e.fileId) return;
        const maxWord = await this.prisma.words.findMany({
          where: {
            fileId: e.fileId,
          },
          orderBy: [
            {
              count: 'desc',
            },
          ],
          take: 1,
        });
        await this.prisma.task.update({
          where: { id: e.id },
          data: { word_max_len: maxWord[0].count, status: 'SUCCESSFULLY' },
        });
        return;
      }),
    );
  }
}
