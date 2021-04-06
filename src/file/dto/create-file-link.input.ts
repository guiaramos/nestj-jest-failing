import { InputType, Field } from '@nestjs/graphql';
import { FileEnum } from './../../common/shared/file-type';

@InputType()
export class CreateFileLinkInput {
  @Field((type) => String, { description: 'the name of the file' })
  name: string;
  @Field((type) => FileEnum)
  type: FileEnum;
  @Field((type) => String, { description: 'file extension ex: png, jpg, pdf' })
  extension: string;
}
