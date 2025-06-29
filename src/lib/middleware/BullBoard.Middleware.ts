import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { QUEUE_NAMES } from '../constants';

@Injectable()
export class BullBoardMiddleware implements NestMiddleware {
  private serverAdapter: ExpressAdapter;

  constructor(
    @InjectQueue(QUEUE_NAMES.EMAIL_NOTIFICATIONS) private emailQueue: Queue,
  ) {
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [new BullAdapter(this.emailQueue)],
      serverAdapter: this.serverAdapter,
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const router = this.serverAdapter.getRouter();

    // Ensure the request URL is properly formatted for Bull Board
    if (!req.url.startsWith('/')) {
      req.url = '/' + req.url;
    }

    router(req, res, next);
  }
}
