import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApolloError, UserInputError } from 'apollo-server-errors';
import * as mongoose from 'mongoose';
import { ERRORS } from 'src/common/constants';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { UpdateUserInput } from 'src/user/dto/update-user.input';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: mongoose.Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput, cognitoId = new mongoose.Types.ObjectId()): Promise<UserDocument> {
    const { email, nickname } = createUserInput;

    await this.userModel.findOne({ email }).then((user) => {
      if (user) {
        throw new UserInputError(ERRORS.USER.EMAIL_USE);
      }
    });

    if (nickname) {
      await this.userModel.findOne({ nickname }).then((user) => {
        if (user) {
          throw new UserInputError(ERRORS.USER.NICK_NAME_USE);
        }
      });
    }

    const createdUser = new this.userModel({ ...createUserInput, cognitoId });
    return await createdUser.save();
  }

  async updateByCognitoId(cognitoId: string, newUser: UpdateUserInput): Promise<UserDocument> {
    const user = await this.userModel.findOne({ cognitoId });
    this.checkUserExist(user);

    return await this.userModel.findOneAndUpdate({ _id: user.id }, { $set: { ...newUser } }, { new: true });
  }

  async findOneById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id);
  }

  async findOneByCognitoId(cognitoId: string): Promise<UserDocument> {
    return await this.userModel.findOne({ cognitoId });
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  async findAll(): Promise<UserDocument[]> {
    return [] as UserDocument[];
  }

  async remove(_id: string) {
    return await this.userModel.deleteOne({ _id });
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userModel
        .findOne({ email })
        .then((res) => {
          if (res) return resolve(false);
          return resolve(true);
        })
        .catch((err) => {
          return reject(new ApolloError(ERRORS.USER.EXIST, ERRORS.CODE.SMTH_WENT_WRONG, err));
        });
    });
  }

  checkUserExist(user: UserDocument) {
    if (user === undefined || user === null) {
      throw new UserInputError(ERRORS.USER.NOT_FOUND);
    }
  }
}
