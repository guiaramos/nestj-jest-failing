import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

@InputType()
export class VerifyPhoneInput {
  @Field()
  @IsPhoneNumber('KR')
  phoneNumber: string;
  @Field()
  @IsString()
  @Length(6)
  code: string;
}
