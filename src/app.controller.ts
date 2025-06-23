import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(@Res() res: Response): void {
    const filePath = join(__dirname, '..', 'public', 'home.html');
    return res.sendFile(filePath);
  }
}
