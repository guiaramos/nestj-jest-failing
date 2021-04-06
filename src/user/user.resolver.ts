import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { CurrentUser } from 'src/common/guards/current-user.guard';
import { UserAuth } from 'src/auth/dto/user.jwt';
import { UpdateUserInput } from 'src/user/dto/update-user.input';
import { RequestPhoneVerInput } from 'src/user/dto/verify-phone.input';
import { VerifyPhoneInput } from 'src/user/dto/confirm-phone.input';
import { IsEmailAvailableInput } from 'src/user/dto/is-email-available.input';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  async getMe(@CurrentUser() currUser: UserAuth): Promise<User> {
    return await this.userService.findOneByCognitoId(currUser.cognitoId);
  }

  @Mutation((returns) => Boolean)
  async isEmailAvailable(@Args('input') input: IsEmailAvailableInput): Promise<boolean> {
    return await this.userService.isEmailAvailable(input.email);
  }

  @Mutation((returns) => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(@CurrentUser() currUser: UserAuth, @Args('input') input: UpdateUserInput): Promise<User> {
    return await this.userService.updateByCognitoId(currUser.cognitoId, input);
  }
}
