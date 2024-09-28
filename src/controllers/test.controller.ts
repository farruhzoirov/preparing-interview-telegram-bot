import { Composer, InlineKeyboard } from 'grammy';
import { MyContext } from '../bot';
import { createTest, getUserTests } from '../services/test.service';
import { getUserByTelegramId } from '../services/auth.service';
import { getRandomQuestion, checkAnswer } from '../services/question.service';

const testController = new Composer<MyContext>();

testController.command('starttest', async (ctx) => {
    const user = await getUserByTelegramId(ctx.from!.id);
    if (!user) {
        await ctx.reply('Please register first using /start');
        return;
    }

    ctx.session.currentTest = {
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
    };

    await askNextQuestion(ctx);
});

testController.on('callback_query:data', async (ctx) => {
    if (!ctx.session.currentTest) return;

    const [action, answerIndex] = ctx.callbackQuery.data.split(':');
    if (action !== 'testanswer') return;

    const currentQuestion = ctx.session.currentTest.questions[ctx.session.currentTest.currentQuestionIndex];
    const isCorrect = await checkAnswer(currentQuestion._id.toString(), currentQuestion.options[Number(answerIndex)]);

    if (isCorrect) {
        ctx.session.currentTest.score += 1;
    }

    ctx.session.currentTest.currentQuestionIndex += 1;

    if (ctx.session.currentTest.currentQuestionIndex < 10) {
        await askNextQuestion(ctx);
    } else {
        await finishTest(ctx);
    }
});

testController.command('mytests', async (ctx) => {
    const user = await getUserByTelegramId(ctx.from!.id);
    if (!user) {
        await ctx.reply('Please register first using /start');
        return;
    }

    const tests = await getUserTests(user._id);
    if (tests.length === 0) {
        await ctx.reply('You haven\'t taken any tests yet.');
        return;
    }

    const testResults = tests.map((test, index) =>
        `${index + 1}. ${test.category} - Score: ${test.score}/10 (${new Date(test.completedAt).toLocaleDateString()})`
    ).join('\n');

    await ctx.reply(`Your test results:\n\n${testResults}`);
});

async function askNextQuestion(ctx: MyContext) {
    const question = await getRandomQuestion('Programming', 'Intermediate');
    if (!question) {
        await ctx.reply('Sorry, no more questions available.');
        await finishTest(ctx);
        return;
    }

    ctx.session.currentTest!.questions.push(question);

    const keyboard = new InlineKeyboard();
    question.options.forEach((option, index) => {
        keyboard.text(option, `testanswer:${index}`).row();
    });

    await ctx.reply(`Question ${ctx.session.currentTest!.currentQuestionIndex + 1}/10:\n\n${question.question}`, { reply_markup: keyboard });
}

async function finishTest(ctx: MyContext) {
    const user = await getUserByTelegramId(ctx.from!.id);
    if (!user) return;

    const test = await createTest(user._id, 'Programming', ctx.session.currentTest!.score);
    await ctx.reply(`Test completed! Your score: ${test.score}/10`);

    delete ctx.session.currentTest;
}

export default testController;