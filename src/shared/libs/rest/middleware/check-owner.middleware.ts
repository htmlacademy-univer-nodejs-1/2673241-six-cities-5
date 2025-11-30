import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { OfferService } from '../../../modules/offer/offer-service.interface.js';

export class CheckOwnerMiddleware implements Middleware {
  constructor(
    private readonly offerService: OfferService,
    private readonly paramName: string
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const offerId = req.params[this.paramName];
    const userId = req.tokenPayload?.id;

    if (!userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'CheckOwnerMiddleware'
      );
    }

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'CheckOwnerMiddleware'
      );
    }

    const authorId = offer.authorId?._id?.toString() ?? offer.authorId?.toString();

    if (authorId !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can only modify your own offers',
        'CheckOwnerMiddleware'
      );
    }

    next();
  }
}
