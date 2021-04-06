import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ERRORS } from 'src/common/constants';
import { Match } from 'src/common/decorators/match.decorator';
import { REGEX } from 'src/common/regex';

@InputType()
export class ForgotPasswordConfirmInput {
  @Field()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(99)
  @Matches(REGEX.PASSWORD, { message: ERRORS.AUTH.PASSWORD_WEAK })
  newPassword: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(99)
  @Match('newPassword')
  newPasswordConfirm: string;
}
