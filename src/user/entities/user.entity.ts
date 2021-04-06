import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { UserRoles } from 'src/common/shared/user-roles';
import { AccountLinkEnum, MediaEnum, RegistrationStatusEnum } from 'src/user/user.schema';

registerEnumType(UserRoles, {
  name: 'UserRoles',
});

registerEnumType(MediaEnum, {
  name: 'MediaEnum',
});

registerEnumType(AccountLinkEnum, {
  name: 'AccountLinkEnum',
});

registerEnumType(RegistrationStatusEnum, {
  name: 'RegistrationStatusEnum',
});

@ObjectType()
export class Profile {
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString()
  camera?: string[];
  @Field({ nullable: true })
  @IsOptional()
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
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  married?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  children?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  pet?: boolean;
}

@ObjectType()
export class Media {
  @Field((type) => MediaEnum, { nullable: true })
  @IsOptional()
  @IsEnum(MediaEnum)
  media?: MediaEnum;
  @Field((type) => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString()
  category?: string[];
}

@ObjectType()
export class AccountLink {
  @Field((type) => AccountLinkEnum, { nullable: true })
  @IsOptional()
  @IsEnum(AccountLinkEnum)
  account?: AccountLinkEnum;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nickname?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  accessToken?: string;
}

@ObjectType()
export class Address {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  complement?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  district?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  province?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @MaxLength(6)
  zip?: number;
}

@ObjectType()
export class Region {
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

@ObjectType()
export class RegistrationInfo {
  @Field((type) => RegistrationStatusEnum, { nullable: true })
  @IsOptional()
  @IsEnum(RegistrationStatusEnum)
  status?: RegistrationStatusEnum;
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  number?: number;
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  file?: string;
}

@ObjectType()
export class BankInfo {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  alias?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bankName?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  accountHolder?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  accountNumber?: number;
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  bankBook?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  default?: boolean;
}

@ObjectType()
export class Notification {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  marketing?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  email?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  SMS?: boolean;
}

@ObjectType()
export class Company {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
  @Field((type) => RegistrationInfo, { nullable: true })
  @IsOptional()
  @ValidateNested()
  registrationInfo?: RegistrationInfo;
  @Field((type) => BankInfo, { nullable: true })
  @IsOptional()
  @ValidateNested()
  bankInfo?: BankInfo[];
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

@ObjectType()
export class User {
  @Field((type) => ID)
  @IsOptional()
  @IsString()
  _id?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cognitoId?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  partnerId?: number;
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
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
  @Field((type) => UserRoles)
  @IsEnum(UserRoles)
  role: UserRoles;
  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber('KR')
  phoneNumber?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  phoneNumberVerified?: boolean;
  @Field((type) => Company, { nullable: true })
  @IsOptional()
  company?: Company;
  @Field((type) => Notification, { nullable: true })
  @IsOptional()
  notification?: Notification;
  @Field((type) => Media, { nullable: true })
  @IsOptional()
  media?: Media[];
  @Field((type) => Address, { nullable: true })
  @IsOptional()
  address?: Address[];
  @Field((type) => Region, { nullable: true })
  @IsOptional()
  region?: Region;
  @Field((type) => AccountLink, { nullable: true })
  accountLink?: AccountLink[];
  @Field((type) => Profile, { nullable: true })
  profile?: Profile;
  @Field()
  @IsDateString()
  createdAt: Date;
  @Field()
  @IsDateString()
  updatedAt: Date;
}
