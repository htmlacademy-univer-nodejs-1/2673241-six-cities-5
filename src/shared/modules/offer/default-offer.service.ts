import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { Types } from 'mongoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, PREMIUM_OFFER_COUNT } from '../../constants/app.constants.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate('authorId')
      .exec();

    if (!offer) {
      this.logger.warn(`Offer with id ${offerId} not found`);
      return null;
    }

    if (userId) {
      const user = await this.userModel.findById(userId).exec();
      const favoriteIds = user?.favorites?.map((id) => id.toString()) || [];
      offer.isFavorite = favoriteIds.includes(offer._id.toString());
    } else {
      offer.isFavorite = false;
    }

    return offer;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('authorId')
      .exec();

    if (updatedOffer) {
      this.logger.info(`Offer ${offerId} updated successfully`);
    } else {
      this.logger.warn(`Offer with id ${offerId} not found for update`);
    }

    return updatedOffer;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const deletedOffer = await this.offerModel
      .findByIdAndDelete(offerId)
      .exec();

    if (deletedOffer) {
      this.logger.info(`Offer ${offerId} deleted successfully`);
    } else {
      this.logger.warn(`Offer with id ${offerId} not found for deletion`);
    }

    return deletedOffer;
  }

  public async find(limit?: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const offerLimit = limit ?? DEFAULT_OFFER_COUNT;
    const offers = await this.offerModel
      .find()
      .sort({ postDate: -1 })
      .limit(offerLimit)
      .populate('authorId')
      .exec();

    if (userId) {
      const user = await this.userModel.findById(userId).exec();
      const favoriteIds = user?.favorites?.map((id) => id.toString()) || [];
      return offers.map((offer) => {
        offer.isFavorite = favoriteIds.includes(offer._id.toString());
        return offer;
      });
    }

    return offers.map((offer) => {
      offer.isFavorite = false;
      return offer;
    });
  }

  public async findPremiumByCity(cityName: string, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find({ 'city.name': cityName, isPremium: true })
      .sort({ postDate: -1 })
      .limit(PREMIUM_OFFER_COUNT)
      .populate('authorId')
      .exec();

    if (userId) {
      const user = await this.userModel.findById(userId).exec();
      const favoriteIds = user?.favorites?.map((id) => id.toString()) || [];
      return offers.map((offer) => {
        offer.isFavorite = favoriteIds.includes(offer._id.toString());
        return offer;
      });
    }

    return offers.map((offer) => {
      offer.isFavorite = false;
      return offer;
    });
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.favorites?.length) {
      return [];
    }

    const offers = await this.offerModel
      .find({ _id: { $in: user.favorites } })
      .sort({ postDate: -1 })
      .populate('authorId')
      .exec();

    return offers.map((offer) => {
      offer.isFavorite = true;
      return offer;
    });
  }

  public async addToFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: offerId } },
      { new: true }
    ).exec();

    const offer = await this.offerModel
      .findById(offerId)
      .populate('authorId')
      .exec();

    if (offer) {
      offer.isFavorite = true;
    }

    return offer;
  }

  public async removeFromFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: offerId } },
      { new: true }
    ).exec();

    const offer = await this.offerModel
      .findById(offerId)
      .populate('authorId')
      .exec();

    if (offer) {
      offer.isFavorite = false;
    }

    return offer;
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({ _id: offerId })) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(
        offerId,
        { $inc: { commentsCount: 1 } },
        { new: true }
      )
      .populate('authorId')
      .exec();

    if (updatedOffer) {
      this.logger.info(`Comment count increased for offer ${offerId}`);
    }

    return updatedOffer;
  }

  public async calculateRating(offerId: string): Promise<number> {
    const result = await this.offerModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(offerId) } },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'offerComments'
          }
        },
        {
          $project: {
            averageRating: {
              $cond: {
                if: { $gt: [{ $size: '$offerComments' }, 0] },
                then: { $round: [{ $avg: '$offerComments.rating' }, 1] },
                else: 1
              }
            }
          }
        }
      ])
      .exec();

    return result[0]?.averageRating ?? 1;
  }

  public async updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const newRating = await this.calculateRating(offerId);

    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(
        offerId,
        { rating: newRating },
        { new: true }
      )
      .populate('authorId')
      .exec();

    if (updatedOffer) {
      this.logger.info(`Rating updated for offer ${offerId}: ${newRating}`);
    } else {
      this.logger.warn(`Failed to update rating for offer ${offerId}`);
    }

    return updatedOffer;
  }
}

