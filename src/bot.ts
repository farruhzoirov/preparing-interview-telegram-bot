import {Bot, session, Context, SessionFlavor, Keyboard, GrammyError, HttpError} from 'grammy';


import { config } from './config/config';

// Controllers
import authController from './controllers/auth.controller';
import questionController from './controllers/questions.controller';
import testController from './controllers/test.controller';
import { getUserByTelegramId } from './services/auth.service';

interface SessionData {
    registrationStep?: 'name' | 'profession' | 'experienceLevel';
    name?: string;
    profession?: string;
    currentQuestion?: string;
    currentTest?: {
        questions: any[];
        currentQuestionIndex: number;
        score: number;
    };
}
export type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(config.botToken);

bot.use(session({ initial: (): SessionData => ({}) }));

bot.use(authController);
bot.use(questionController);
bot.use(testController);

async function showMenu(ctx: MyContext) {
    const keyboard = new Keyboard()
        .text('/question').text('/starttest').row()
        .text('/mytests').text('/profile').row()
        .resized();

    await ctx.reply('Choose an option:', { reply_markup: keyboard });
}

bot.command('menu', showMenu);

bot.command('profile', async (ctx) => {
    const user = await getUserByTelegramId(ctx.from!.id);
    if (!user) {
        await ctx.reply('Please register first using /start');
        return;
    }

    await ctx.reply(
        `Your profile:\n\nName: ${user.name}\nProfession: ${user.profession}\nExperience Level: ${user.experienceLevel}`
    );
});

bot.on('message', (ctx) => ctx.reply('Sorry, I don\'t understand that command. Please use /menu to see available options.'));

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

export default bot;