import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class PublicRouteMiddleware implements Middleware {
  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (tokenPayload) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'This route is only accessible for anonymous users.',
        'PublicRouteMiddleware'
      );
    }

    return next();
  }
}
