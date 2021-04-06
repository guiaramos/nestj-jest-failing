import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      cors: {
        origin: process.env.FRONT_URL,
        credentials: true,
      },
      path: '/api/graphql',
      context: ({ req, res }) => ({ req, res }),
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    CacheModule.register({
      store: redisStore,
      host: process.env.DATABASE_CACHE_HOST,
      port: process.env.DATABASE_CACHE_PORT,
    }),
    AuthModule,
    UserModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
