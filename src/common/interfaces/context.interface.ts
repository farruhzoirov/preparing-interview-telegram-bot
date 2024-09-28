export interface SessionData {
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