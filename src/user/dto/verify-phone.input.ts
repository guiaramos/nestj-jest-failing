import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber } from 'class-validator';

@InputType()
export class RequestPhoneVerInput {
  @Field()
  @IsPhoneNumber('KR')
  phoneNumber: string;
}
