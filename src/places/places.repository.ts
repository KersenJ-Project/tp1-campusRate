import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from './schemas/place.schema';

@Injectable()
export class PlacesRepository {
    constructor( @InjectModel(Place.name) private readonly placeModel: Model<PlaceDocument>) {}

    async findAll( filter: Record<string, string>, skip: number, limit: number): Promise<PlaceDocument[]> {
        return await this.placeModel
            .find(filter)
            .sort({ createdAt: 1})
            .skip(skip)
            .limit(limit)
            .exec();
    }

    async count(filter: Record<string, string>): Promise<number> {
        return await this.placeModel.countDocuments(filter).exec();
    }

    async findById(id: string): Promise<PlaceDocument | null> {
        return await this.placeModel.findById(id).exec();
    }

    async exists(id: string): Promise<boolean> {
        const result = await this.placeModel.exists({ _id: id });
        return result !== null;
    }

    async create(data: Partial<Place>): Promise<PlaceDocument> {
        return await this.placeModel.create(data);
    }

    async updateById(id: string, data: Partial<Place>): Promise<PlaceDocument | null> {
        return await this.placeModel
            .findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after', runValidators: true })
            .exec();
    }

    async updateStats( id: string, reviewCount: number, averageRating: number | null ): Promise<void> {
        await this.placeModel
            .updateOne({ _id: id }, { $set: { reviewCount, averageRating } }, { timestamps: false })
            .exec();
    }

    async deleteById(id: string): Promise<void> {
        await this.placeModel.findByIdAndDelete(id).exec();
    }
}