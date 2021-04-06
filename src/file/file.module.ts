import { Module } from '@nestjs/common';
import { FileConfig } from 'src/file/file.config';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';

@Module({
  providers: [FileResolver, FileService, FileConfig],
})
export class FileModule {}
