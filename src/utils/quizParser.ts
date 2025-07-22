import { Question, QuizOption } from '../types/Quiz';

export const parseQuizText = (text: string): Question[] => {
  if (!text.trim()) return [];
  
  const questions: Question[] = [];
  
  // Tách các câu hỏi bằng cách tìm pattern "Đáp án đúng:" 
  // và giả định câu hỏi mới bắt đầu sau đó (hoặc từ đầu text)
  const parts = text.split('Đáp án đúng:');
  
  // Nếu chỉ có 1 part, có nghĩa là không có "Đáp án đúng:" nào
  if (parts.length === 1) return questions;
  
  // Xử lý từng part
  for (let i = 0; i < parts.length - 1; i++) {
    let questionPart = parts[i];
    let answerPart = parts[i + 1];
    
    // Nếu không phải part đầu tiên, cần lấy phần cuối của part trước (có thể là câu hỏi tiếp theo)
    if (i > 0) {
      // Tìm câu hỏi mới trong part trước (thường bắt đầu sau dấu xuống dòng)
      const lines = questionPart.split('\n');
      let questionStartIndex = -1;
      
      // Tìm dòng đầu tiên có nội dung (không phải empty line)
      for (let j = 1; j < lines.length; j++) {
        if (lines[j].trim() && !lines[j].trim().match(/^[A-Z]\./)) {
          questionStartIndex = j;
          break;
        }
      }
      
      if (questionStartIndex > -1) {
        questionPart = lines.slice(questionStartIndex).join('\n');
      } else {
        continue; // Không tìm thấy câu hỏi mới
      }
    }
    
    // Parse phần đáp án để lấy correct answers
    const answerLines = answerPart.split('\n');
    const correctAnswerLine = answerLines[0].trim();
    const correctAnswers = correctAnswerLine.split(',').map(ans => ans.trim()).filter(ans => ans);
    
    if (correctAnswers.length === 0) continue;
    
    // Parse phần câu hỏi
    const questionLines = questionPart.trim().split('\n').filter(line => line.trim());
    if (questionLines.length < 2) continue; // Cần ít nhất câu hỏi và 1 option
    
    let questionText = '';
    const options: QuizOption[] = [];
    let questionTextLines: string[] = [];
    let foundFirstOption = false;
    
    for (const line of questionLines) {
      const trimmedLine = line.trim();
      
      // Kiểm tra nếu là option (A., B., C., D., etc.)
      const optionMatch = trimmedLine.match(/^([A-Z])\.\s*(.+)$/);
      if (optionMatch) {
        // Nếu gặp option đầu tiên, kết thúc việc đọc câu hỏi
        if (!foundFirstOption) {
          questionText = questionTextLines.join(' ').trim();
          foundFirstOption = true;
        }
        
        options.push({
          id: optionMatch[1],
          text: optionMatch[2].trim()
        });
      } else if (!foundFirstOption) {
        // Thêm vào câu hỏi nếu chưa gặp option
        questionTextLines.push(trimmedLine);
      }
    }
    
    // Nếu chưa set questionText
    if (!questionText && questionTextLines.length > 0) {
      questionText = questionTextLines.join(' ').trim();
    }
    
    // Tạo question object nếu có đủ thông tin
    if (questionText && options.length > 0 && correctAnswers.length > 0) {
      questions.push({
        id: `question-${questions.length + 1}`,
        text: questionText,
        options,
        correctAnswers,
        userAnswers: []
      });
    }
  }
  
  return questions;
};

export const calculateQuizResult = (questions: Question[]) => {
  const totalQuestions = questions.length;
  let correctCount = 0;
  
  const questionResults = questions.map(question => {
    const userAnswers = question.userAnswers.sort();
    const correctAnswers = question.correctAnswers.sort();
    
    const isCorrect = userAnswers.length === correctAnswers.length && 
                     userAnswers.every((answer, index) => answer === correctAnswers[index]);
    
    if (isCorrect) correctCount++;
    
    return {
      questionId: question.id,
      isCorrect,
      userAnswers: question.userAnswers,
      correctAnswers: question.correctAnswers
    };
  });
  
  return {
    totalQuestions,
    correctAnswers: correctCount,
    incorrectAnswers: totalQuestions - correctCount,
    score: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0,
    questionResults
  };
}; 