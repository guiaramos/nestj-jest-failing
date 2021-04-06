import * as cookieParser from 'cookie-parser';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserInputError } from 'apollo-server-errors';
import { AppModule } from './app.module';

global['fetch'] = require('node-fetch');

function normalizePort(val: string): string | number {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }

  return 0;
}

async function bootstrap() {
  const PORT = normalizePort(process.env.PORT || process.env.BACKEND_PORT || '4000');

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const error_messages = errors.map((error) => Object.values(error.constraints));
        return new UserInputError(error_messages.map((e) => e.join('; ')).join('; '));
      },
      forbidUnknownValues: false,
    })
  );

  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
  });

  await app.listen(PORT);
  console.log(`🚀 Application is running on: ${await app.getUrl()}/api/graphql`);
}
bootstrap();
