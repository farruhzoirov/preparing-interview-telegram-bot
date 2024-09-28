import { User, IUser } from '../models/user.model';

export async function registerUser(telegramId: number, name: string, profession: string, experienceLevel: string): Promise<IUser> {
    const user = new User({
        telegramId,
        name,
        profession,
        experienceLevel,
    });
    await user.save();
    return user;
}


export async function getUserByTelegramId(telegramId: number): Promise<IUser | null> {
    return User.findOne({ telegramId });
}