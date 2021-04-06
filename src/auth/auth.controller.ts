import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AuthService') private authService: AuthService) {}

  @Get('callback')
  async validateGoogle(@Req() req: Request, @Res() res: Response) {
    this.authService.getAuthFromOauth(req, res);
  }

  @Get('sign-up')
  async validateSignUp(@Req() req: Request, @Res() res: Response) {
    this.authService.signUpConfirm(req, res);
  }
}
