import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    telegramId: number;
    name: string;
    profession: string;
    experienceLevel: string;
}

const userSchema = new Schema<IUser>({
    telegramId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    profession: { type: String, required: true },
    experienceLevel: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);