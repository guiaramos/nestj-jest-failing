import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ERRORS } from 'src/common/constants';
import { Match } from 'src/common/decorators/match.decorator';
import { REGEX } from 'src/common/regex';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
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
  @Match('newPassword', { message: ERRORS.AUTH.PASSWORD_MATCH })
  newPasswordConfirm: string;
}
