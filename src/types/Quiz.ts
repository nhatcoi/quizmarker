export interface QuizOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuizOption[];
  correctAnswers: string[];
  userAnswers: string[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  mode: QuizMode;
}

export type QuizMode = 'practice' | 'test';

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  questionResults: {
    questionId: string;
    isCorrect: boolean;
    userAnswers: string[];
    correctAnswers: string[];
  }[];
} 