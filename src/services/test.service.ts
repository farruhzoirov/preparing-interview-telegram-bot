import { Test, ITest } from '../models/test.model';
import mongoose from 'mongoose';

export async function createTest(userId: mongoose.Types.ObjectId, category: string, score: number): Promise<ITest> {
    const test = new Test({
        userId,
        category,
        score,
    });
    await test.save();
    return test;
}

export async function getUserTests(userId: mongoose.Types.ObjectId): Promise<ITest[]> {
    return Test.find({ userId }).sort({ completedAt: -1 });
}