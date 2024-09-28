import mongoose from 'mongoose';
import { config } from '../config/config';

export async function connectToDatabase() {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('Connected to Database');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}