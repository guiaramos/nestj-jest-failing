import { Injectable } from '@nestjs/common';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { ApolloError } from 'apollo-server-errors';
import { Response } from 'express';
import { ERRORS } from 'src/common/constants';
import { IContext } from 'src/common/shared/context';
import { JwtTokensFromCode } from 'src/common/shared/token-code';

@Injectable()
export class CookieService {
  private readonly OneMonth = 30 * 24 * 60 * 60 * 1000;
  private readonly OneHour = 1 * 60 * 60 * 1000;
  private readonly RefreshToken = `${process.env.COOKIE}.refreshToken`;
  private readonly AccessToken = `${process.env.COOKIE}.accessToken`;
  private readonly IdToken = `${process.env.COOKIE}.idToken`;

  assignCookiesFromCognito(userSess: CognitoUserSession, ctx: IContext) {
    const payload = this.getCognitoPayload(userSess);

    const cognitoId = payload['cognito:username'];
    const accessToken = userSess.getAccessToken().getJwtToken();
    const idToken = userSess.getIdToken().getJwtToken();
    const refreshToken = userSess.getRefreshToken().getToken();

    this.assignCookies(ctx.res, refreshToken, accessToken, idToken);

    return { cognitoId };
  }

  assignCookiesFromOAuth(res: Response, tokens: JwtTokensFromCode) {
    const { refresh_token, access_token, id_token } = tokens;

    this.assignCookies(res, refresh_token, access_token, id_token);
  }

  assignCookies(res: Response, refreshToken: string, accessToken: string, idToken: string) {
    res.cookie(this.RefreshToken, refreshToken, { maxAge: this.OneMonth, httpOnly: true });
    res.cookie(this.AccessToken, accessToken, { maxAge: this.OneHour, httpOnly: true });
    res.cookie(this.IdToken, idToken, { maxAge: this.OneHour, httpOnly: true });
  }

  async destroySession(ctx: IContext): Promise<boolean> {
    return new Promise((resolve) => {
      ctx.res.clearCookie(this.AccessToken);
      ctx.res.clearCookie(this.RefreshToken);
      ctx.res.clearCookie(this.IdToken);
      resolve(true);
    });
  }

  getCognitoPayload(userSess: CognitoUserSession) {
    const payload = userSess.getIdToken().decodePayload();
    if (!payload) {
      throw new ApolloError(ERRORS.AUTH.NOT_FOUND_PAYLOAD);
    }
    return payload;
  }
}
