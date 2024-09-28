import bot from './bot';
import { connectToDatabase } from './utils/database';

async function startBot() {
    try {
        await connectToDatabase();
        await bot.start();
        console.log('Bot started successfully');
    } catch (error) {
        console.error('Error starting the bot:', error);
        process.exit(1);
    }
}

startBot();