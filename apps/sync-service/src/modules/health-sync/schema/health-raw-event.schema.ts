import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HealthRawEventDocument =
    HydratedDocument<HealthRawEvent>;

@Schema({
    timestamps: true,
    collection: 'health_raw_events',
})
export class HealthRawEvent {

    @Prop({
        required: true,
        index: true,
    })
    userId!: string;

    @Prop({
        required: true,
    })
    source!: string;

    @Prop({
        required: true,
    })
    dataType!: string;

    @Prop({
        required: true,
    })
    receivedAt!: Date;

    @Prop({
        type: Object,
        required: true,
    })
    payload!: Record<string, any>;
}

export const HealthRawEventSchema =
    SchemaFactory.createForClass(
        HealthRawEvent,
    );