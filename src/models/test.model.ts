import mongoose, { Document, Schema } from 'mongoose';

export interface ITest extends Document {
    userId: mongoose.Types.ObjectId;
    category: string;
    score: number;
    completedAt: Date;
}

const testSchema = new Schema<ITest>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    score: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
});

export const Test = mongoose.model<ITest>('Test', testSchema);




