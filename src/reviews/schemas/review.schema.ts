import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type ReviewDocument = HydratedDocument<Review>;

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
export class Review {
    @Prop({ type: String, default: () => `rev_${randomUUID().substring(0, 8)}` })
    _id: string;

    @Prop({ type: String, required: true, index: true })
    placeId: string;

    @Prop({ required: true, trim: true })
    authorName: string;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop({ required: true, trim: true, minlength: 10, maxlength: 500 })
    comment: string;

    createdAt: Date;
    updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);