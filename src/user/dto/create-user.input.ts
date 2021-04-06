import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserRoles } from 'src/common/shared/user-roles';
import { Media, Region } from 'src/user/entities/user.entity';
import { MediaEnum } from 'src/user/user.schema';

@InputType()
export class MediaInput extends Media {
  @Field((type) => MediaEnum)
  @IsEnum(MediaEnum)
  media: MediaEnum;
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString()
  category?: string[];
}

@InputType()
export class RegionInput extends Region {
  @Field({ nullable: true })
  @IsOptional()
  activity?: boolean;
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString()
  seoul?: string[];
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString()
  gyeonggi?: string[];
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString()
  other?: string[];
}

@InputType()
export class CreateUserCompanyInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  managerName?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mgrPhoneNumber?: string;
}

@InputType()
export class CreateUserNotificationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  marketing?: boolean;
}

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nickname?: string;
  @Field()
  @IsEmail()
  email: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  picture?: string;
  @Field((type) => UserRoles)
  role: UserRoles;
  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  company?: CreateUserCompanyInput;
  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  notification?: CreateUserNotificationInput;
  @Field((type) => MediaInput, { nullable: true })
  @IsOptional()
  media?: MediaInput[];
  @Field((type) => RegionInput, { nullable: true })
  @IsOptional()
  region?: RegionInput;
  @Field()
  @IsOptional()
  @IsPhoneNumber('KR')
  phoneNumber?: string;
}
