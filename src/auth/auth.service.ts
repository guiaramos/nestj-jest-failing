import { Inject, Injectable, HttpException, HttpStatus, CACHE_MANAGER } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import * as qs from 'qs';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  ICognitoUserData,
  IAuthenticationDetailsData,
  CognitoUserAttribute,
  CognitoIdToken,
} from 'amazon-cognito-identity-js';
import { ApolloError, UserInputError } from 'apollo-server-errors';
import { Request, Response } from 'express';
import { isString } from 'class-validator';
import { JwtTokensFromCode } from 'src/common/shared/token-code';
import { AuthConfig } from 'src/auth/auth.config';
import { SignInInput } from 'src/auth/dto/sign-in.input';
import { SignUpInput } from 'src/auth/dto/sign-up.input';
import { ERRORS } from 'src/common/constants';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CookieService } from 'src/auth/cookie.service';
import { UserRoles } from 'src/common/shared/user-roles';
import { ForgotPasswordInput } from 'src/auth/dto/forgot-password.input';
import { ResendLinkInput } from 'src/auth/dto/resend-link-sing-up.input';
import { ForgotPasswordConfirmInput } from 'src/auth/dto/forgot-password-confirm.input';
import { ChangePasswordInput } from 'src/auth/dto/change-password.input';
import { UserAuth } from 'src/auth/dto/user.jwt';

@Injectable()
export class AuthService {
  private userPoll: CognitoUserPool;
  private readonly FIVE_SECONDS = 300;

  constructor(
    @Inject('AuthConfig') private readonly authConfig: AuthConfig,
    @Inject('UserService') private userService: UserService,
    @Inject('CookieService') private cookieService: CookieService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.userPoll = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async signUpUser(user: SignUpInput): Promise<User> {
    const newUser = await this.userService.create(user);
    return new Promise((resolve, reject) => {
      return this.userPoll.signUp(
        newUser.cognitoId,
        user.password,
        [new CognitoUserAttribute({ Name: 'email', Value: user.email })],
        null,
        async (error, result) => {
          if (!result) {
            this.userService.remove(newUser._id).then(({ ok }) => {
              if (!ok) return reject(new ApolloError(ERRORS.AUTH.SIGN_UP_DELETE, ERRORS.CODE.SMTH_WENT_WRONG, error));
              return reject(new ApolloError(ERRORS.AUTH.SIGN_UP, ERRORS.CODE.SMTH_WENT_WRONG, error));
            });
          } else {
            return resolve(newUser);
          }
        }
      );
    });
  }

  async signInUser({ email, password }: SignInInput): Promise<CognitoUserSession> {
    const user = await this.userService.findOneByEmail(email);
    const authenticationDetails = this.getAuthDetails(email, password);
    const CognitoUser = this.getCognitoUser(user.cognitoId);

    return await new Promise((resolve, reject) => {
      return CognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          return resolve(result);
        },
        onFailure: (err) => {
          if (err.code === 'UserNotConfirmedException') return reject(new UserInputError(ERRORS.AUTH.CONFIRM_ACCOUNT));
          return reject(new ApolloError(ERRORS.AUTH.SIGN_IN, ERRORS.CODE.SMTH_WENT_WRONG, err));
        },
      });
    });
  }

  async resendSignUpLink(resendLinkInput: ResendLinkInput): Promise<boolean> {
    const cognitoUser = await this.getCognitoUserByEmail(resendLinkInput.email);
    return new Promise((resolve, reject) => {
      return cognitoUser.resendConfirmationCode((err) => {
        if (err) return reject(new ApolloError(ERRORS.AUTH.RESEND_CODE, ERRORS.CODE.SMTH_WENT_WRONG, err));
        return resolve(true);
      });
    });
  }

  async signUpConfirm(req: Request, res: Response) {
    const { code, email } = this.getCodeAndEmailFromRequest(req);
    const cognitoUser = await this.getCognitoUserByEmail(email);
    return new Promise((resolve) => {
      cognitoUser.confirmRegistration(code, true, (err) => {
        if (err) {
          resolve(this.redirectToWebsite(res, err.message));
        }
        resolve(this.redirectToWebsite(res));
      });
    });
  }

  getCodeAndEmailFromRequest(req: Request): { email: string; code: string } {
    const { query } = req;
    if (!query?.code || !query?.email) {
      throw new HttpException('The code or email were not received', HttpStatus.FORBIDDEN);
    }
    const { code, email } = req.query;
    if (!isString(code) || !isString(email)) {
      throw new HttpException('The code or email are not type string', HttpStatus.FORBIDDEN);
    }

    return { code, email };
  }

  async forgotPasswordConfirm(forgotPasswordConfirmInput: ForgotPasswordConfirmInput): Promise<boolean> {
    const { email, code, newPassword } = forgotPasswordConfirmInput;
    const isCache = await this.cacheManager.get(email);
    if (!isCache) throw new UserInputError(ERRORS.AUTH.FORGOT_PASSWORD_EXPIRE);
    const cognitoUser = await this.getCognitoUserByEmail(email);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess() {
          return resolve(true);
        },
        onFailure(err) {
          return reject(new ApolloError(ERRORS.AUTH.NEW_PASSWORD, ERRORS.CODE.SMTH_WENT_WRONG, err));
        },
      });
    });
  }

  async forgotPassword(forgotPasswordData: ForgotPasswordInput): Promise<boolean> {
    const { email } = forgotPasswordData;
    const cognitoUser = await this.getCognitoUserByEmail(email);
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: async () => {
          await this.cacheManager.set(email, 'forgotPassword', { ttl: this.FIVE_SECONDS });
          return resolve(true);
        },
        onFailure: (err) => reject(new ApolloError(ERRORS.AUTH.FORGOT_PASSWORD, ERRORS.CODE.SMTH_WENT_WRONG, err)),
      });
    });
  }

  async changePassword(currUser: UserAuth, changePasswordData: ChangePasswordInput): Promise<boolean> {
    const { oldPassword, newPassword } = changePasswordData;

    return new Promise((resolve, reject) => {
      const currentUser = this.getCognitoUser(currUser.cognitoId);
      const authenticationDetails = this.getAuthDetails(currUser.email, oldPassword);

      currentUser.authenticateUser(authenticationDetails, {
        onFailure: (err) => {
          return reject(
            new ApolloError(ERRORS.AUTH.CHANGE_PASSWORD, ERRORS.CODE.SMTH_WENT_WRONG, {
              message: err.message || JSON.stringify(err),
              name: err.name,
              stack: err.stack,
            })
          );
        },

        onSuccess: (sess) => {
          currentUser.changePassword(oldPassword, newPassword, (err, res) => {
            if (err) {
              return reject(
                new ApolloError(ERRORS.AUTH.CHANGE_PASSWORD, ERRORS.CODE.SMTH_WENT_WRONG, {
                  message: err.message || JSON.stringify(err),
                  name: err.name,
                  stack: err.stack,
                })
              );
            }

            if (res === 'SUCCESS') {
              return resolve(true);
            }

            return reject(new ApolloError(ERRORS.AUTH.CHANGE_PASSWORD, ERRORS.CODE.SMTH_WENT_WRONG, res));
          });
        },
      });
    });
  }

  getAuthDetails(email: string, password: string) {
    const authenticationData: IAuthenticationDetailsData = {
      Username: email,
      Password: password,
    };
    return new AuthenticationDetails(authenticationData);
  }

  async getCognitoUserByEmail(email: string): Promise<CognitoUser> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UserInputError(ERRORS.USER.NOT_FOUND);
    return this.getCognitoUser(user.cognitoId);
  }

  getCognitoUser(id: string): CognitoUser {
    const userData: ICognitoUserData = {
      Username: id,
      Pool: this.userPoll,
    };
    return new CognitoUser(userData);
  }

  async getAuthFromOauth(req: Request, res: Response) {
    try {
      const tokens = await this.getTokenFromRequest(req);
      this.cookieService.assignCookiesFromOAuth(res, tokens);
      const { cognitoId, email, name, picture } = this.getUserFromIdToken(tokens.id_token);
      const user = await this.userService.findOneByCognitoId(cognitoId);
      if (!user) {
        await this.userService.create({ email, name, picture, role: UserRoles.INFLUENCER }, cognitoId);
      }
      this.redirectToWebsite(res);
    } catch (error) {
      if (error.data.error && error.status) throw new HttpException(error.data.error, error.status);
      this.redirectToWebsite(res, error);
    }
  }

  getUserFromIdToken(IdToken: string) {
    const payload = new CognitoIdToken({ IdToken }).decodePayload();
    const cognitoId = payload['cognito:username'];
    const email = payload['email'];
    const emailVerified = payload['email_verified'];
    const name = payload['name'];
    const picture = payload['picture'];
    return { cognitoId, email, emailVerified, name, picture };
  }

  redirectToWebsite(res: Response, error?: string) {
    const sendError = error ? `?error=${error}` : '/';
    res.redirect(`${process.env.FRONT_URL}${sendError}`);
  }

  async getTokenFromRequest(req: Request): Promise<JwtTokensFromCode> {
    const { query } = req;
    if (!query?.code) throw new HttpException('Code not receive from google', HttpStatus.FORBIDDEN);
    const { code } = req.query;
    return new Promise((resolve, reject) => {
      try {
        const data = qs.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.COGNITO_CLIENT_ID,
          code: code,
          redirect_uri: `${process.env.BACKEND_URL}/auth/callback/`,
        });
        const config: AxiosRequestConfig = {
          method: 'post',
          url: `${process.env.AWS_DOMAIN}/oauth2/token`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data,
        };

        axios(config)
          .then(function (response: AxiosResponse<JwtTokensFromCode>) {
            resolve(response.data);
          })
          .catch(function (error) {
            reject(error.response);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
