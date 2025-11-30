import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(limit?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: string, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  removeFromFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(offerId: string): Promise<boolean>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  calculateRating(offerId: string): Promise<number>;
  updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
