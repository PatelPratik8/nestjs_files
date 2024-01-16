import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}


  @Get(':id')
  countUniqueWords( @Param('id', ParseIntPipe) id: number) {
    return this.uploadService.countUniqueWords(id);
  }

  @Get(':id/word')
  countWords( @Param('id', ParseIntPipe) id: number) {
    return this.uploadService.countWords(id);
  }

  @Get(':id/word/:word')
  findTopKWords( @Param('id', ParseIntPipe) id: number,ParseIntPipe,@Param('word') word: string) {
    return this.uploadService.findTopKWords(id,word);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('txtFile', { dest: './uploadFileData' }))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000 }),
          new FileTypeValidator({ fileType: 'text/plain' }),
        ],
      }),
    )
    txtFile: Express.Multer.File,
  ) {
    let data: any = {
      name: txtFile.originalname,
      size: txtFile.size,
      mimetype: txtFile.mimetype,
    };

    if (txtFile.encoding) data.encoding = txtFile.encoding;
    if (txtFile.path) data.location = txtFile.path;

    return this.uploadService.createFile(data);
  }


}
