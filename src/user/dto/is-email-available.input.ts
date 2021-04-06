import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class IsEmailAvailableInput {
  @Field()
  @IsEmail()
  email: string;
}
