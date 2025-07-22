import React, { useState } from 'react';
import { Question, QuizMode } from '../types/Quiz';
import { parseQuizText } from '../utils/quizParser';
import { formatTextWithGemini } from '../services/geminiService';

interface QuizInputProps {
  onQuizCreated: (questions: Question[], mode: QuizMode) => void;
}

const QuizInput: React.FC<QuizInputProps> = ({ onQuizCreated }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [selectedMode, setSelectedMode] = useState<QuizMode>('test');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const questions = parseQuizText(inputText);
      if (questions.length === 0) {
        alert('Không thể tạo câu hỏi từ text này. Vui lòng kiểm tra lại format.');
        return;
      }
      
      onQuizCreated(questions, selectedMode);
    } catch (error) {
      alert('Có lỗi xảy ra khi parse câu hỏi. Vui lòng kiểm tra lại format.');
      console.error('Parse error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatText = async () => {
    if (!inputText.trim()) {
      alert('Vui lòng nhập text trước khi format.');
      return;
    }

    setIsFormatting(true);
    
    try {
      const formattedText = await formatTextWithGemini(inputText);
      setInputText(formattedText);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi format text.');
      console.error('Format error:', error);
    } finally {
      setIsFormatting(false);
    }
  };

  const sampleText = `Lợi ích nào của AWS Cloud hỗ trợ việc khớp cung cấp tài nguyên với nhu cầu khối lượng công việc thay đổi?
A. Tính khả dụng cao.
B. Phạm vi toàn cầu.
C. Tính đàn hồi (Elasticity).
D. Chi phí biến đổi thấp hơn do quy mô kinh tế khổng lồ.
Đáp án đúng: C

Tính đàn hồi của AWS Cloud giúp khách hàng tiết kiệm chi phí so với các nhà cung cấp dịch vụ lưu trữ truyền thống. Khách hàng AWS có thể làm gì để hưởng lợi từ tính đàn hồi của AWS Cloud? (Chọn HAI)
A. Triển khai tài nguyên của bạn trên nhiều Vùng sẵn sàng.
B. Sử dụng Amazon EC2 Auto Scaling.
C. Triển khai tài nguyên của bạn trong một khu vực khác.
D. Sử dụng cân bằng tải Elastic.
E. Sử dụng Điện toán phi máy chủ (Serverless Computing) bất cứ khi nào có thể.
Đáp án đúng: B, E`;

  const sampleUnformattedText = `Tính đàn hồi của AWS Cloud giúp khách hàng tiết kiệm chi phí so với các nhà cung cấp dịch vụ lưu trữ truyền thống. Khách hàng AWS có thể làm gì để hưởng lợi từ tính đàn hồi của AWS Cloud? (Chọn HAI)
Triển khai tài nguyên của bạn trên nhiều Vùng sẵn sàng.
Sử dụng Amazon EC2 Auto Scaling.
Triển khai tài nguyên của bạn trong một khu vực khác.
Sử dụng cân bằng tải Elastic.
Sử dụng Điện toán phi máy chủ (Serverless Computing) bất cứ khi nào có thể.
câu đúng: 2, 5`;

  return (
    <div className="quiz-input">
      <h2>Tạo Quiz từ Text</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mode-selection">
          <label>Chọn chế độ làm quiz:</label>
          <div className="mode-options">
            <label className="mode-option">
              <input
                type="radio"
                name="mode"
                value="test"
                checked={selectedMode === 'test'}
                onChange={(e) => setSelectedMode(e.target.value as QuizMode)}
              />
              <span className="mode-text">
                <strong>Kiểm tra</strong>
                {/* <small>Hiển thị kết quả sau khi hoàn thành tất cả câu hỏi</small> */}
              </span>
            </label>
            <label className="mode-option">
              <input
                type="radio"
                name="mode"
                value="practice"
                checked={selectedMode === 'practice'}
                onChange={(e) => setSelectedMode(e.target.value as QuizMode)}
              />
              <span className="mode-text">
                <strong>Ôn tập</strong>
                {/* <small>Hiển thị đáp án ngay sau mỗi câu hỏi</small> */}
              </span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="quiz-text">
            Nhập câu hỏi theo format (mỗi câu hỏi có các lựa chọn A, B, C... và "Đáp án đúng: X"):
            <br />
            {/* <small>💡 Có thể dùng tính năng "Format Text" để tự động format text chưa chuẩn bằng AI</small> */}
          </label>
          <textarea
            id="quiz-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ví dụ text đã chuẩn format:\n\n${sampleText}`}
            rows={15}
            cols={80}
            required
          />
        </div>
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => setInputText(sampleText)}
            className="sample-btn"
            disabled={isFormatting || isLoading}
          >
            Ví dụ chuẩn
          </button>
          {/* <button 
            type="button" 
            onClick={() => setInputText(sampleUnformattedText)}
            className="sample-btn demo-unformatted"
            disabled={isFormatting || isLoading}
          >
            Ví dụ chưa chuẩn
          </button> */}
          <button 
            type="button"
            onClick={handleFormatText}
            disabled={isFormatting || isLoading || !inputText.trim()}
            className="format-btn"
          >
            {isFormatting ? 'Đang format...' : 'Format Text'}
          </button>
          <button 
            type="submit" 
            disabled={isLoading || isFormatting || !inputText.trim()}
            className="create-btn"
          >
            {isLoading ? 'Đang tạo quiz...' : 'Tạo Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizInput; 