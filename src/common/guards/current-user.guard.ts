import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserAuth } from 'src/auth/dto/user.jwt';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserAuth => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  }
);
