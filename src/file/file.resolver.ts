import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { CreateFileLinkInput } from './dto/create-file-link.input';

@Resolver(() => File)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => File)
  @UseGuards(GqlAuthGuard)
  createFileLink(@Args('createFileLinkInput') createFileLinkInput: CreateFileLinkInput) {
    return this.fileService.createPresignedUrl(createFileLinkInput);
  }

  // @Query(() => [File], { name: 'file' })
  // findAll() {
  //   return this.fileService.findAll();
  // }

  // @Query(() => File, { name: 'file' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.fileService.findOne(id);
  // }

  // @Mutation(() => File)
  // updateFile(@Args('updateFileInput') updateFileInput: UpdateFileInput) {
  //   return this.fileService.update(updateFileInput.id, updateFileInput);
  // }

  // @Mutation(() => File)
  // removeFile(@Args('id', { type: () => Int }) id: number) {
  //   return this.fileService.remove(id);
  // }
}
