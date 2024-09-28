import dotenv from 'dotenv';

dotenv.config();

export const config = {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    mongodbUri: process.env.MONGODB_URI || '',
};