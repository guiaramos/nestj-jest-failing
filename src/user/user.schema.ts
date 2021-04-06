import * as mongoose from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import { UserRoles } from 'src/common/shared/user-roles';

export enum AccountLinkEnum {
  'YOUTUBE' = 'YOUTUBE',
  'INSTAGRAM' = 'INSTAGRAM',
}

export enum MediaEnum {
  'YOUTUBE' = 'YOUTUBE',
  'INSTAGRAM' = 'INSTAGRAM',
  'BLOG' = 'BLOG',
  'TWITCH' = 'TWITCH',
  'AFREECATV' = 'AFREECATV',
}

export enum RegistrationStatusEnum {
  'PENDING' = 'PENDING',
  'VERIFIED' = 'VERIFIED',
}

export interface ProfileDocument extends mongoose.Document {
  camera?: string[];
  exposure: boolean;
  topSize?: string;
  bottomSize?: string;
  shoesSize?: string;
  height?: number;
  skin?: string;
  married: boolean;
  children: boolean;
  pet: boolean;
}

export const ProfileSchema = new mongoose.Schema({
  camera: { type: String },
  exposure: { type: Boolean, default: false },
  topSize: { type: String },
  bottomSize: { type: String },
  shoesSize: { type: String },
  height: { type: Number },
  skin: { type: String },
  married: { type: Boolean, default: false },
  children: { type: Boolean, default: false },
  pet: { type: Boolean, default: false },
});

export interface MediaDocument extends mongoose.Document {
  media: MediaEnum;
  category?: string[];
}

export const MediaSchema = new mongoose.Schema({
  media: { type: String, enum: MediaEnum, require: true },
  category: { type: [String] },
});

export interface AccountLinkDocument extends mongoose.Document {
  account: AccountLinkEnum;
  nickname: string;
  accessToken: string;
}

export const AccountLinkSchema = new mongoose.Schema({
  account: { type: String, enum: AccountLinkEnum, require: true },
  nickname: { type: String },
  accessToken: { type: String },
});

export interface AddressDocument extends mongoose.Document {
  address: string;
  complement: string;
  district: string;
  province: string;
  zip: number;
}

export const AddressSchema = new mongoose.Schema({
  complement: { type: String, require: true },
  address: { type: String, require: true },
  district: { type: String, require: true },
  province: { type: String, require: true },
  zip: { type: Number, require: true },
});

export interface RegionDocument extends mongoose.Document {
  activity?: boolean;
  seoul?: string[];
  gyeonggi?: string[];
  other?: string[];
}

export const RegionSchema = new mongoose.Schema({
  activity: { type: Boolean },
  seoul: { type: [String] },
  gyeonggi: { type: [String] },
  other: { type: [String] },
});

export interface RegistrationInfoDocument extends mongoose.Document {
  status: RegistrationStatusEnum;
  number: number;
  file: string;
}

export const RegistrationInfoSchema = new mongoose.Schema({
  status: { type: String, enum: RegistrationStatusEnum, default: RegistrationStatusEnum.PENDING },
  number: { type: Number, require: true },
  file: { type: String, require: true },
});

export interface BankInfoDocument extends mongoose.Document {
  alias: string;
  bankName: string;
  accountHolder: string;
  accountNumber: number;
  bankBook: string;
  default: boolean;
}

export const BankInfoSchema = new mongoose.Schema({
  alias: { type: String, require: true },
  bankName: { type: String, require: true },
  accountHolder: { type: String, require: true },
  accountNumber: { type: Number, require: true },
  bankBook: { type: String, require: true },
  default: { type: Boolean, require: true },
});

export interface NotificationDocument extends mongoose.Document {
  marketing: boolean;
  email: boolean;
  SMS: boolean;
}

export const NotificationSchema = new mongoose.Schema({
  marketing: { type: Boolean, default: false },
  email: { type: Boolean, default: false },
  SMS: { type: Boolean, default: false },
});

export interface CompanyDocument extends mongoose.Document {
  name?: string;
  registrationInfo?: RegistrationInfoDocument;
  bankInfo?: BankInfoDocument[];
  ownerName?: string;
  managerName?: string;
  classification?: string;
  industry?: string;
  mgrPhoneNumber?: string;
  communicationRegNo?: string;
  bizPhoneNumber?: string;
  bizFaxNumber?: string;
  websiteUrl?: string;
}

export const CompanySchema = new mongoose.Schema({
  name: { type: String },
  registrationInfo: { type: RegistrationInfoSchema },
  bankInfo: { type: BankInfoSchema },
  ownerName: { type: String },
  managerName: { type: String },
  classification: { type: String },
  industry: { type: String },
  mgrPhoneNumber: { type: String },
  communicationRegNo: { type: String },
  bizPhoneNumber: { type: String },
  bizFaxNumber: { type: String },
  websiteUrl: { type: String },
});

export interface UserDocument extends mongoose.Document {
  cognitoId: string;
  partnerId: number;
  email: string;
  name: string;
  nickname?: string;
  picture?: string; // TODO: must be required once we have the default picture
  birthYear?: number;
  role: UserRoles;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  company?: CompanyDocument;
  notification?: NotificationDocument;
  media?: MediaDocument[];
  address?: AddressDocument[];
  region?: RegionDocument;
  accountLink?: AccountLinkDocument[];
  profile?: ProfileDocument;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new mongoose.Schema(
  {
    cognitoId: { type: String, index: true },
    partnerId: { type: Number, required: true },
    email: { type: String, require: true },
    name: { type: String, require: true },
    nickname: { type: String, unique: true },
    picture: { type: String },
    birthYear: { type: Number },
    role: { type: String, enum: UserRoles, require: true },
    phoneNumber: { type: String },
    phoneNumberVerified: { type: Boolean, default: false },
    company: { type: CompanySchema },
    notification: { type: NotificationSchema },
    media: { type: [MediaSchema] },
    address: { type: [AddressSchema] },
    region: { type: RegionSchema },
    accountLink: { type: [AccountLinkSchema] },
    profile: { type: ProfileSchema },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

UserSchema.plugin(autoIncrement, {
  model: 'User',
  field: 'partnerId',
  startAt: 192348,
  incrementBy: 1,
});
