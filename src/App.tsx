import React, { useState } from 'react';
import QuizInput from './components/QuizInput';
import QuizDisplay from './components/QuizDisplay';
import QuizResult from './components/QuizResult';
import ErrorBoundary from './components/ErrorBoundary';
import { Question, QuizMode } from './types/Quiz';
import './App.css';

type AppState = 'input' | 'quiz' | 'result';

const shuffleQuestions = (questions: Question[]) => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  const [currentState, setCurrentState] = useState<AppState>('input');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<Question[]>([]);
  const [quizMode, setQuizMode] = useState<QuizMode>('test');

  const handleQuizCreated = (
    newQuestions: Question[],
    mode: QuizMode
  ) => {
    setQuestions(shuffleQuestions(newQuestions));
    setQuizMode(mode);
    setCurrentState('quiz');
  };

  const handleQuizComplete = (answeredQuestions: Question[]) => {
    setCompletedQuestions(answeredQuestions);
    setCurrentState('result');
  };

  const handleRestart = () => {
    setQuestions([]);
    setCompletedQuestions([]);
    setCurrentState('input');
  };

  const handleRetakeQuiz = () => {
    const resetQuestions = questions.map(q => ({ ...q, userAnswers: [] }));
    setQuestions(shuffleQuestions(resetQuestions));
    setCurrentState('quiz');
  };

  const handleBackToInput = () => {
    setCurrentState('input');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quiz Maker</h1>
        <p>NhatCoiDzai</p>
      </header>

      <ErrorBoundary>
        <main className="App-main">
          {currentState === 'input' && (
            <QuizInput onQuizCreated={handleQuizCreated} />
          )}

          {currentState === 'quiz' && (
            <QuizDisplay 
              questions={questions}
              mode={quizMode}
              onQuizComplete={handleQuizComplete}
              onBack={handleBackToInput}
            />
          )}

          {currentState === 'result' && (
            <QuizResult 
              questions={completedQuestions}
              onRestart={handleRestart}
              onRetakeQuiz={handleRetakeQuiz}
            />
          )}
        </main>
      </ErrorBoundary>
    </div>
  );
}

export default App;
