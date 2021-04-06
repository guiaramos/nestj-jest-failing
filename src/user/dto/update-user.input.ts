import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { AccountLinkEnum, MediaEnum, RegistrationStatusEnum } from 'src/user/user.schema';

@InputType()
export class UpdateRegistrationInfoInput {
  @Field((type) => RegistrationStatusEnum)
  @IsEnum(RegistrationStatusEnum)
  status: RegistrationStatusEnum;
  @Field()
  @IsNumber()
  number: number;
  @Field()
  @IsUrl()
  file: string;
}

@InputType()
export class UpdateBankInfoInput {
  @Field()
  @IsString()
  alias: string;
  @Field()
  @IsString()
  bankName: string;
  @Field()
  @IsString()
  accountHolder: string;
  @Field()
  @IsNumber()
  accountNumber: number;
  @Field()
  @IsUrl()
  bankBook: string;
  @Field()
  @IsBoolean()
  default: boolean;
}

@InputType()
export class UpdateCompanyInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
  @Field((type) => UpdateRegistrationInfoInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  registrationInfo?: UpdateRegistrationInfoInput;
  @Field((type) => UpdateBankInfoInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  bankInfo?: UpdateBankInfoInput[];
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ownerName?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  managerName?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  classification?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  industry?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mgrPhoneNumber?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  communicationRegNo?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bizPhoneNumber?: string;
  @IsOptional()
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bizFaxNumber?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  websiteUrl?: string;
}

@InputType()
export class UpdateNotificationInput {
  @Field()
  @IsBoolean()
  marketing: boolean;
  @Field()
  @IsBoolean()
  email: boolean;
  @Field()
  @IsBoolean()
  SMS: boolean;
}

@InputType()
export class UpdateMediaInput {
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
export class UpdateAddressInput {
  @Field()
  address: string;
  @Field()
  @IsString()
  complement: string;
  @Field()
  @IsString()
  district: string;
  @Field()
  @IsString()
  province: string;
  @Field()
  @IsNumber()
  @MaxLength(6)
  zip: number;
}

@InputType()
export class UpdateRegionInput {
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
export class UpdateAccountLinkInput {
  @Field((type) => AccountLinkEnum)
  @IsEnum(AccountLinkEnum)
  account: AccountLinkEnum;
  @Field()
  @IsString()
  nickname: string;
  @Field()
  @IsString()
  accessToken: string;
}

@InputType()
export class UpdateProfileInput {
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString()
  camera?: string[];
  @Field()
  @IsBoolean()
  exposure: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  topSize?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bottomSize?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shoesSize?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  height?: number;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  skin?: string;
  @Field()
  @IsBoolean()
  married: boolean;
  @Field()
  @IsBoolean()
  children: boolean;
  @Field()
  @IsBoolean()
  pet: boolean;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nickname?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  picture?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  birthYear?: number;
  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber('KR')
  phoneNumber?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  phoneNumberVerified?: boolean;
  @Field((type) => UpdateCompanyInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  company?: UpdateCompanyInput;
  @Field((type) => UpdateNotificationInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  notification?: UpdateNotificationInput;
  @Field((type) => UpdateMediaInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  media?: UpdateMediaInput[];
  @Field((type) => UpdateAddressInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  address?: UpdateAddressInput[];
  @Field((type) => UpdateRegionInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  region?: UpdateRegionInput;
  @Field((type) => UpdateAccountLinkInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  accountLink?: UpdateAccountLinkInput[];
  @Field((type) => UpdateProfileInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  profile?: UpdateProfileInput;
}
