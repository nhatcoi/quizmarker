import React, { useState, useEffect } from 'react';
import { Question, QuizMode } from '../types/Quiz';

interface QuizDisplayProps {
  questions: Question[];
  mode: QuizMode;
  onQuizComplete: (updatedQuestions: Question[]) => void;
  onBack: () => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ questions, mode, onQuizComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Question[]>(
    questions.map(q => ({ ...q, userAnswers: [] }))
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState<NodeJS.Timeout | null>(null);

  const currentQuestion = userAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Cleanup timer on unmount or question change
  useEffect(() => {
    return () => {
      if (autoNextTimer) {
        clearTimeout(autoNextTimer);
      }
    };
  }, [autoNextTimer, currentQuestionIndex]);

  // Check if user has selected enough answers to evaluate
  const hasSelectedEnoughAnswers = (question: Question) => {
    return question.userAnswers.length === question.correctAnswers.length;
  };

  // Auto advance to next question after delay
  const autoAdvanceToNext = () => {
    const timer = setTimeout(() => {
      if (isLastQuestion) {
        onQuizComplete(userAnswers);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowAnswer(false);
      }
    }, 2500);
    
    setAutoNextTimer(timer);
  };

  const handleAnswerSelect = (optionId: string) => {
    // Don't allow selection if already showing answer in practice mode
    if (mode === 'practice' && showAnswer) {
      return;
    }

    const updatedAnswers = [...userAnswers];
    const currentAnswers = updatedAnswers[currentQuestionIndex].userAnswers;
    
    if (currentAnswers.includes(optionId)) {
      // Bỏ chọn nếu đã chọn
      updatedAnswers[currentQuestionIndex].userAnswers = currentAnswers.filter(
        answer => answer !== optionId
      );
    } else {
      // Thêm vào nếu chưa chọn
      updatedAnswers[currentQuestionIndex].userAnswers = [...currentAnswers, optionId];
    }
    
    setUserAnswers(updatedAnswers);

    // In practice mode, auto-check answer when enough selections are made
    if (mode === 'practice') {
      const updatedQuestion = updatedAnswers[currentQuestionIndex];
      
      if (hasSelectedEnoughAnswers(updatedQuestion)) {
        setShowAnswer(true);
        autoAdvanceToNext();
      }
    }
  };

  const handleNext = () => {
    // Clear any existing timer
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      setAutoNextTimer(null);
    }

    if (isLastQuestion) {
      onQuizComplete(userAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    // Clear any existing timer
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      setAutoNextTimer(null);
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
    }
  };

  const getAnsweredCount = () => {
    return userAnswers.filter(q => q.userAnswers.length > 0).length;
  };



  const getButtonText = () => {
    if (mode === 'practice') {
      if (showAnswer) {
        return 'Đang chuyển câu...';
      }
      const needMoreSelections = currentQuestion.userAnswers.length < currentQuestion.correctAnswers.length;
      if (needMoreSelections) {
        return `Chọn ${currentQuestion.correctAnswers.length - currentQuestion.userAnswers.length} đáp án nữa`;
      }
    }
    return isLastQuestion ? 'Hoàn thành Quiz' : 'Câu tiếp theo →';
  };

  return (
    <div className="quiz-display">
      <div className="quiz-header">
        <button onClick={onBack} className="back-btn">
          ← Quay lại
        </button>
        <div className="quiz-info">
          <div className="mode-indicator">
            {mode === 'practice' ? 'Chế độ ôn tập' : 'Chế độ kiểm tra'}
          </div>
          <div className="progress">
            <span>Câu hỏi {currentQuestionIndex + 1} / {questions.length}</span>
            <span>Đã trả lời: {getAnsweredCount()} / {questions.length}</span>
          </div>
        </div>
      </div>

      <div className="question-container">
        <h3>Câu hỏi {currentQuestionIndex + 1}:</h3>
        <p className="question-text">{currentQuestion.text}</p>

        <div className="options-container">
          {currentQuestion.options.map((option) => {
            const isSelected = currentQuestion.userAnswers.includes(option.id);
            const isCorrect = currentQuestion.correctAnswers.includes(option.id);
            const isPracticeWithAnswer = mode === 'practice' && showAnswer;
            
            let optionStatus = '';
            if (isPracticeWithAnswer) {
              if (isSelected && isCorrect) {
                optionStatus = 'correct-selected';
              } else if (isSelected && !isCorrect) {
                optionStatus = 'incorrect-selected';
              } else if (!isSelected && isCorrect) {
                optionStatus = 'correct-unselected';
              }
            }

            return (
              <div key={option.id} className={`option-item ${optionStatus}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(option.id)}
                    disabled={isPracticeWithAnswer}
                  />
                  <span className="option-text">
                    <strong>{option.id}.</strong> {option.text}
                    {isPracticeWithAnswer && (
                      <span className="option-feedback">
                        {isSelected && isCorrect && '✅'}
                        {isSelected && !isCorrect && '❌'}
                        {!isSelected && isCorrect && '✅'}
                      </span>
                    )}
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        {currentQuestion.userAnswers.length > 0 && (
          <div className="selected-answers">
            <p>Bạn đã chọn: {currentQuestion.userAnswers.join(', ')}</p>
          </div>
        )}
{/* 
        {mode === 'practice' && showAnswer && (
          <div className={`auto-feedback ${checkAnswer() ? 'correct' : 'incorrect'}`}>
            <div className="feedback-message">
              {checkAnswer() ? (
                <>
                  <span className="feedback-icon">✅</span>
                  <span>Chính xác! Tự động chuyển sang câu tiếp theo...</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">❌</span>
                  <span>Chưa chính xác. Tự động chuyển sang câu tiếp theo...</span>
                </>
              )}
            </div>
          </div>
        )}
         */}
      </div>

      <div className="navigation">
        <button 
          onClick={handlePrevious} 
          disabled={currentQuestionIndex === 0}
          className="nav-btn prev-btn"
        >
          ← Câu trước
        </button>
        
        <button 
          onClick={handleNext}
          disabled={
            mode === 'practice' 
              ? showAnswer || currentQuestion.userAnswers.length < currentQuestion.correctAnswers.length
              : currentQuestion.userAnswers.length === 0
          }
          className="nav-btn next-btn"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default QuizDisplay; 