import { Composer } from 'grammy';
import { MyContext } from '../bot';
import { registerUser, getUserByTelegramId } from '../services/auth.service';

const authController = new Composer<MyContext>();

authController.command('start', async (ctx, next) => {
    const user = await getUserByTelegramId(ctx.from!.id);
    if (user) {
        await ctx.reply('Welcome back! Use /menu to see available options.');
    } else {
        await ctx.reply('Welcome! Please register to use the bot. What\'s your name?');
        ctx.session.registrationStep = 'name';
    }
});

authController.on('message:text', async (ctx) => {
    if (!ctx.session.registrationStep) return;
    console.log(ctx.message.text);
    switch (ctx.session.registrationStep) {
        case 'name':
            ctx.session.name = ctx.message.text;
            await ctx.reply('What\'s your profession?');
            ctx.session.registrationStep = 'profession';
            break;
        case 'profession':
            ctx.session.profession = ctx.message.text;
            await ctx.reply('What\'s your experience level? (Beginner/Intermediate/Advanced)');
            ctx.session.registrationStep = 'experienceLevel';
            break;
        case 'experienceLevel':
            const { name, profession } = ctx.session;
            if (name && profession) {
                const user = await registerUser(ctx.from!.id, name, profession, ctx.message.text);
                await ctx.reply(`Registration complete! Welcome, ${user.name} and click this /menu.`);
                delete ctx.session.registrationStep;
                delete ctx.session.name;
                delete ctx.session.profession;
            }
            break;
    }
});


export default authController;