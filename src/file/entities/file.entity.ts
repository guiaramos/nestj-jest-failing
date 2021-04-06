import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { FileEnum } from 'src/common/shared/file-type';

registerEnumType(FileEnum, {
  name: 'FileEnum',
});

@ObjectType()
export class File {
  @Field(() => String, { description: 'the url to post the file' })
  url: string;
  @Field(() => String, { description: 'after posting the file, it will be available on this url' })
  fileUrl: string;
  @Field(() => String, { description: 'the name of the file' })
  name: string;
}
