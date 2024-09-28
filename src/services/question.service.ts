import { Question, IQuestion } from '../models/question.model';

export async function getRandomQuestion(category: string, difficulty: string): Promise<IQuestion | null> {
    const count = await Question.countDocuments({ category, difficulty });
    const random = Math.floor(Math.random() * count);
    return Question.findOne({ category, difficulty }).skip(random);
}

export async function checkAnswer(questionId: string, answer: string): Promise<boolean> {
    const question = await Question.findById(questionId);
    return question?.correctAnswer === answer;
}