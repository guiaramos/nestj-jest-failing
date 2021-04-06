import { CacheModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TwilioModule } from 'nestjs-twilio';
import { AuthConfig } from 'src/auth/auth.config';
import { AuthController } from 'src/auth/auth.controller';
import { AuthResolver } from 'src/auth/auth.resolver';
import { CookieService } from 'src/auth/cookie.service';
import { SignUpInput } from 'src/auth/dto/sign-up.input';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserRoles } from 'src/common/shared/user-roles';
import { closeInMongoDConnection, rootMongooseTestModule } from 'src/test-utils/mongo/MongooseTestModule';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        CacheModule.register(),
        UserModule,
      ],
      providers: [AuthService, AuthResolver, AuthConfig, CookieService, JwtStrategy],
      exports: [AuthService],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up new user', async () => {
    const user: SignUpInput = {
      name: 'Testing',
      email: 'testing@gmail.com',
      role: UserRoles.ADVERTISER,
      phoneNumber: '+821020964919',
      password: 'Test2105@',
      passwordConfirm: 'Test2105@',
    };

    const savedUser = await service.signUpUser(user);

    delete user['password'];
    delete user['passwordConfirm'];

    expect(savedUser).toEqual(expect.objectContaining(user));
  });

  afterAll(async () => {
    await closeInMongoDConnection();
  });
});
