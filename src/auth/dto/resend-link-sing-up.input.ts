import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ResendLinkInput {
  @Field()
  @IsEmail()
  email: string;
}
