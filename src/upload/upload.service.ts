import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: DatabaseService) {}

  async getFiles() {
    return this.prisma.files.findMany();
  }

  getWordArray(fileInfo) {
    let wordData = [];
    let map = {};
    const fileData = fs.readFileSync(fileInfo.location).toString();
    let fileSplitData = fileData.replace(/[^a-zA-Z0-9 ]/g, '').split(' ');
    for (let i of fileSplitData) {
      if (i.length < 2) continue;
      if (map[i]) map[i] = map[i] + 1;
      else map[i] = 1;
    }
    Object.keys(map).map(async (j) => {
      let data = {
        count: map[j],
        word: j,
        fileId: fileInfo.id,
      };
      wordData.push(data);
    });
    return wordData;
  }

  async createFile(createFileDto: Prisma.FilesCreateInput) {
    const fileInfo = await this.prisma.files.create({ data: createFileDto });

    if (!(fileInfo.location && fileInfo.encoding)) return fileInfo;

    const wordData = this.getWordArray(fileInfo);

    await this.prisma.words.createMany({ data: wordData });

    return fileInfo;
  }

  async countUniqueWords(id) {
    let words = await this.prisma.words.count({
      where: { fileId: id, count: { lt: 2 } },
    });
    return { data: words };
  }
  async findTopKWords(id, word) {    
    let wordData = await this.prisma.words.findFirst({ where: { fileId: id, word } });
    
    return { data: wordData.count };
  }
}
