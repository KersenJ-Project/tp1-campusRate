import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Place, PlaceDocument } from '../places/schemas/place.schema';

@Injectable()
export class ReviewsRepository {
    constructor(
        @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
        @InjectModel(Place.name) private readonly placeModel: Model<PlaceDocument>,
    ) {}

    async findAll(): Promise<Review[]> {
        return this.reviewModel.find().sort({ createdAt: 1, }).exec();
    }

    async findById(id: string): Promise<Review | null> {
        return this.reviewModel.findById(id).exec();
    }

    async findByPlace(placeId: string): Promise<Review[]> {
        return this.reviewModel.find({ placeId }).sort({ createdAt: 1, }).exec();
    }

    async create(data: Partial<Review>): Promise<Review> {
        return this.reviewModel.create(data);
    }

    async updateById(id: string, data: Partial<Review>): Promise<Review | null> {
        return this.reviewModel
        .findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after', runValidators: true })
        .exec();
    }

    async deleteById(id: string): Promise<Review | null> {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }

    async placeExists(placeId: string): Promise<boolean> {
        const result = await this.placeModel.exists({ _id: placeId });
        return result !== null;
    }
}