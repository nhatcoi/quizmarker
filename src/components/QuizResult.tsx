import React from 'react';
import { Question } from '../types/Quiz';
import { calculateQuizResult } from '../utils/quizParser';

interface QuizResultProps {
  questions: Question[];
  onRestart: () => void;
  onRetakeQuiz: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ questions, onRestart, onRetakeQuiz }) => {
  const result = calculateQuizResult(questions);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Xanh lá
    if (score >= 60) return '#FF9800'; // Cam
    return '#F44336'; // Đỏ
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Xuất sắc! 🎉';
    if (score >= 80) return 'Rất tốt! 👏';
    if (score >= 70) return 'Tốt! 👍';
    if (score >= 60) return 'Khá! 😊';
    return 'Cần cố gắng thêm! 💪';
  };

  return (
    <div className="quiz-result">
      <div className="result-header">
        <h2>Kết quả Quiz</h2>
        <div className="score-display" style={{ color: getScoreColor(result.score) }}>
          <div className="score-circle">
            <span className="score-number">{result.score}%</span>
          </div>
          <p className="score-message">{getScoreMessage(result.score)}</p>
        </div>
      </div>

      <div className="result-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-number">{result.totalQuestions}</span>
            <span className="stat-label">Tổng câu hỏi</span>
          </div>
          <div className="stat-item correct">
            <span className="stat-number">{result.correctAnswers}</span>
            <span className="stat-label">Đúng</span>
          </div>
          <div className="stat-item incorrect">
            <span className="stat-number">{result.incorrectAnswers}</span>
            <span className="stat-label">Sai</span>
          </div>
        </div>
      </div>

      <div className="detailed-results">
        <h3>Chi tiết từng câu hỏi:</h3>
        {questions.map((question, index) => {
          const questionResult = result.questionResults.find(r => r.questionId === question.id);
          const isCorrect = questionResult?.isCorrect || false;
          
          return (
            <div key={question.id} className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="question-header">
                <h4>
                  Câu {index + 1}: {isCorrect ? '✅' : '❌'}
                </h4>
              </div>
              
              <p className="question-text">{question.text}</p>
              
              <div className="answer-comparison">
                <div className="user-answers">
                  <strong>Bạn đã chọn:</strong>
                  {question.userAnswers.length > 0 ? (
                    <ul>
                      {question.userAnswers.map(answer => (
                        <li key={answer}>
                          {answer}. {question.options.find(opt => opt.id === answer)?.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="no-answer">Không có đáp án</span>
                  )}
                </div>
                
                <div className="correct-answers">
                  <strong>Đáp án đúng:</strong>
                  <ul>
                    {question.correctAnswers.map(answer => (
                      <li key={answer} className="correct-answer">
                        {answer}. {question.options.find(opt => opt.id === answer)?.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="result-actions">
        <button onClick={onRetakeQuiz} className="retake-btn">
          Làm lại Quiz này
        </button>
        <button onClick={onRestart} className="new-quiz-btn">
          Tạo Quiz mới
        </button>
      </div>
    </div>
  );
};

export default QuizResult; 