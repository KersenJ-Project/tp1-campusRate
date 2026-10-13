import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { PlaceCategory } from '../enums/placeCategory.enum';
import { PlaceStatus } from '../enums/placeStatus.enum';

export type PlaceDocument = HydratedDocument<Place>;

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (_doc, ret: Record<string, any>) => {
            ret.id = ret._id;
            delete ret._id;
            return ret;
        },
    },
})

export class Place {
    @Prop({ type: String, default: () => `plc_${randomUUID().substring(0, 8)}` })
    _id: string;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true, enum: Object.values(PlaceCategory) })
    category: PlaceCategory;

    @Prop({ required: true, trim: true })
    address: string;

    @Prop({ type: [String], default: [] })
    services: string[];

    @Prop({ required: true, enum: Object.values(PlaceStatus), default: PlaceStatus.ACTIVE })
    status: PlaceStatus;

    @Prop({ type: Number, default: null })
    averageRating: number | null;

    @Prop({ default: 0, min: 0 })
    reviewCount: number;

    createdAt: Date;
    updatedAt: Date;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);