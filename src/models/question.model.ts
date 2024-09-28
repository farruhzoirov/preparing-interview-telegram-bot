import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
    category: string;
    difficulty: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

const questionSchema = new Schema<IQuestion>({
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
});

export const Question = mongoose.model<IQuestion>('Question', questionSchema);