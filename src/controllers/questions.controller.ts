import { Composer, InlineKeyboard } from 'grammy';
import { MyContext } from '../bot';
import { getRandomQuestion, checkAnswer } from '../services/question.service';

const questionController = new Composer<MyContext>();

questionController.command('question', async (ctx) => {
    console.log("Requested ...")
    const question = await getRandomQuestion('Programming', 'Intermediate');
    if (!question) {
        await ctx.reply('Sorry, no questions available at the moment.');
        return;
    }

    const keyboard = new InlineKeyboard();
    question.options.forEach((option, index) => {
        keyboard.text(option, `answer:${index}`).row();
    });

    await ctx.reply(question.question, { reply_markup: keyboard });
    ctx.session.currentQuestion = question._id!.toString();
});

questionController.on('callback_query:data', async (ctx) => {
    if (!ctx.session.currentQuestion) return;

    const [action, index] = ctx.callbackQuery.data.split(':');
    if (action !== 'answer') return;

    const question = await getRandomQuestion('Programming', 'Intermediate');
    if (!question) return;

    const isCorrect = await checkAnswer(ctx.session.currentQuestion, question.options[Number(index)]);
    await ctx.answerCallbackQuery({
        text: isCorrect ? 'Correct!' : 'Incorrect. Try again!',
        show_alert: true,
    });

    delete ctx.session.currentQuestion;
});

export default questionController;