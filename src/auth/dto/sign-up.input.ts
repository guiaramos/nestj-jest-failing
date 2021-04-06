import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ERRORS } from 'src/common/constants';
import { Match } from 'src/common/decorators/match.decorator';
import { REGEX } from 'src/common/regex';
import { CreateUserInput } from 'src/user/dto/create-user.input';

@InputType()
export class SignUpInput extends CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(99)
  @Matches(REGEX.PASSWORD, { message: ERRORS.AUTH.PASSWORD_WEAK })
  password: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(99)
  @Match('password', { message: ERRORS.AUTH.PASSWORD_MATCH })
  passwordConfirm: string;
}
