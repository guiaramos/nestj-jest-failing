import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { Request } from 'express';
import { CognitoIdToken } from 'amazon-cognito-identity-js';
import { AuthConfig } from 'src/auth/auth.config';
import { AuthService } from 'src/auth/auth.service';
import { UserAuth } from 'src/auth/dto/user.jwt';

function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) token = req.cookies[`${process.env.COOKIE}.idToken`];
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private authConfig: AuthConfig) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),

      jwtFromRequest: cookieExtractor,
      audience: authConfig.clientId,
      issuer: authConfig.authority,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: CognitoIdToken['payload']): Promise<UserAuth> {
    return { cognitoId: payload['cognito:username'], email: payload.email };
  }
}
