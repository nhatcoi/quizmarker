import React, { useState } from 'react';
import QuizInput from './components/QuizInput';
import QuizDisplay from './components/QuizDisplay';
import QuizResult from './components/QuizResult';
import ErrorBoundary from './components/ErrorBoundary';
import { Question, QuizMode } from './types/Quiz';
import './App.css';

type AppState = 'input' | 'quiz' | 'result';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('input');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<Question[]>([]);
  const [quizMode, setQuizMode] = useState<QuizMode>('test');

  const handleQuizCreated = (newQuestions: Question[], mode: QuizMode) => {
    setQuestions(newQuestions);
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
    // Reset user answers và quay về quiz
    const resetQuestions = questions.map(q => ({ ...q, userAnswers: [] }));
    setQuestions(resetQuestions);
    setCurrentState('quiz');
  };

  const handleBackToInput = () => {
    setCurrentState('input');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quiz Maker</h1>
        <p>Tạo và làm quiz từ text đơn giản</p>
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
