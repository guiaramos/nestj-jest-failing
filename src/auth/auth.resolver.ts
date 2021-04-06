import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { AuthService } from 'src/auth/auth.service';
import { CookieService } from 'src/auth/cookie.service';
import { ChangePasswordInput } from 'src/auth/dto/change-password.input';
import { ForgotPasswordConfirmInput } from 'src/auth/dto/forgot-password-confirm.input';
import { ForgotPasswordInput } from 'src/auth/dto/forgot-password.input';
import { ResendLinkInput } from 'src/auth/dto/resend-link-sing-up.input';
import { SignInInput } from 'src/auth/dto/sign-in.input';
import { SignUpInput } from 'src/auth/dto/sign-up.input';
import { UserAuth } from 'src/auth/dto/user.jwt';
import { ERRORS } from 'src/common/constants';
import { CurrentUser } from 'src/common/guards/current-user.guard';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { IContext } from 'src/common/shared/context';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly cookieService: CookieService
  ) {}

  @Mutation((returns) => User)
  async signIn(@Args('input') input: SignInInput, @Context() ctx: IContext): Promise<User> {
    const userSess = await this.authService.signInUser(input);
    const { cognitoId } = this.cookieService.assignCookiesFromCognito(userSess, ctx);
    return this.userService.findOneByCognitoId(cognitoId);
  }

  @Mutation((returns) => User)
  async signUp(@Args('input') input: SignUpInput): Promise<User> {
    return this.authService.signUpUser(input);
  }

  @Mutation((returns) => Boolean)
  async resendSignUpLink(@Args('input') input: ResendLinkInput): Promise<boolean> {
    return this.authService.resendSignUpLink(input);
  }

  @Mutation((returns) => Boolean)
  async forgotPassword(@Args('input') input: ForgotPasswordInput): Promise<boolean> {
    return this.authService.forgotPassword(input);
  }

  @Mutation((returns) => Boolean)
  async forgotPasswordConfirm(@Args('input') input: ForgotPasswordConfirmInput): Promise<boolean> {
    return this.authService.forgotPasswordConfirm(input);
  }

  @Mutation((returns) => Boolean)
  @UseGuards(GqlAuthGuard)
  async signOut(@Context() ctx: IContext) {
    const isDeleted = this.cookieService.destroySession(ctx);
    if (!isDeleted) throw new ApolloError(ERRORS.AUTH.LOG_OUT);
    return true;
  }

  @Mutation((returns) => Boolean)
  @UseGuards(GqlAuthGuard)
  async changePassword(@CurrentUser() currUser: UserAuth, @Args('input') input: ChangePasswordInput): Promise<boolean> {
    return this.authService.changePassword(currUser, input);
  }
}
