import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ERRORS } from 'src/common/constants';
import { REGEX } from 'src/common/regex';

@InputType()
export class SignInInput {
  @Field()
  @IsString()
  @IsEmail()
  email: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(99)
  @Matches(REGEX.PASSWORD, { message: ERRORS.AUTH.PASSWORD_WEAK })
  password: string;
}
