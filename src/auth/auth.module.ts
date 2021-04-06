import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthConfig } from 'src/auth/auth.config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CookieService } from 'src/auth/cookie.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, PassportModule.register({ defaultStrategy: 'jwt' }), CacheModule.register()],
  providers: [AuthService, AuthResolver, AuthConfig, CookieService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
