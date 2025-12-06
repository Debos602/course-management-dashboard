import { useState, useEffect } from 'react';

export const Quiz = ({ quiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isSubmitted) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSubmitted]);

  const handleAnswerSelect = (answerIndex) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({
        ...prev,
        [quiz[currentQuestion]._id]: answerIndex
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const totalMarks = quiz.reduce((sum, q) => sum + q.marks, 0);
    alert(`Quiz Completed!\nYour Score: ${score}/${totalMarks}\nTime: ${formatTime(timeSpent)}`);
    setReviewMode(true);
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach(q => {
      if (selectedAnswers[q._id] === q.correctAnswerIndex) {
        score += q.marks;
      }
    });
    return score;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz || quiz.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow mt-4 border border-gray-100 text-center">
        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p className="text-base font-medium text-gray-600">No quiz questions available.</p>
      </div>
    );
  }

  const currentQ = quiz[currentQuestion];
  const isAnswered = selectedAnswers[currentQ._id] !== undefined;
  const isCorrect = selectedAnswers[currentQ._id] === currentQ.correctAnswerIndex;
  const totalQuestions = quiz.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-2xl mx-auto bg-white p-5 rounded-lg shadow mt-4 border border-gray-100">
      {/* Quiz Header - More Compact */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-3 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-bold text-gray-800">📝 Performance Engineering Quiz</h3>
          <p className="text-sm text-gray-600 mt-1">Question {currentQuestion + 1} of {totalQuestions}</p>
        </div>
        <div className="mt-2 sm:mt-0 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md font-medium text-sm">
          ⏱️ {formatTime(timeSpent)}
        </div>
      </div>

      {/* Compact Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Progress</span>
          <span className="text-xs font-medium text-blue-600">{answeredCount}/{totalQuestions} answered</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Question - Compact */}
      <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
        {/* Question Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
          <div className="flex items-start">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-base font-bold mr-2 mt-1 flex-shrink-0">
              {currentQuestion + 1}
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-800">
                {currentQ.question}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''}
                </span>
                {isAnswered && !isSubmitted && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Answered
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Answer Options - Compact */}
        <div className="ml-0 sm:ml-10 space-y-2 mt-3">
          {currentQ.options.map((option, optIdx) => {
            let optionStyle = "bg-white border-gray-200";
            let checkStyle = "";
            let isSelected = selectedAnswers[currentQ._id] === optIdx;
            
            if (reviewMode || isSubmitted) {
              if (optIdx === currentQ.correctAnswerIndex) {
                optionStyle = "bg-green-50 border-green-200 text-green-800";
                checkStyle = "text-green-600";
              } else if (isSelected && optIdx !== currentQ.correctAnswerIndex) {
                optionStyle = "bg-red-50 border-red-200 text-red-800";
                checkStyle = "text-red-600";
              }
            } else if (isSelected) {
              optionStyle = "bg-blue-50 border-blue-200 text-blue-800";
              checkStyle = "text-blue-600";
            }

            return (
              <label 
                key={optIdx}
                className={`flex items-center p-3 rounded cursor-pointer transition-all border ${optionStyle} 
                  ${!reviewMode && !isSubmitted ? 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer' : 'cursor-default'}`}
                onClick={() => handleAnswerSelect(optIdx)}
              >
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-2 flex-shrink-0
                  ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-base flex-1">
                  <span className={`${checkStyle} ${!reviewMode && !isSubmitted && !isSelected ? 'text-gray-700' : ''}`}>
                    <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span> {option}
                  </span>
                  {(reviewMode || isSubmitted) && optIdx === currentQ.correctAnswerIndex && (
                    <span className="ml-2 inline-flex items-center text-xs font-medium bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Correct
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>

        {/* Question Feedback - Compact */}
        {(reviewMode || isSubmitted) && (
          <div className={`ml-0 sm:ml-10 mt-4 p-3 rounded ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start">
              <div className={`p-1.5 rounded-full mr-2 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                {isCorrect ? (
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <h5 className={`text-sm font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h5>
                <p className={`text-xs mt-0.5 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect 
                    ? `You earned ${currentQ.marks} mark${currentQ.marks > 1 ? 's' : ''}.`
                    : `The correct answer is highlighted above.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons - More Compact */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-200">
        <div className="w-full sm:w-auto order-2 sm:order-1">
          <button
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all border border-gray-300 hover:border-gray-400 active:scale-95 transform flex items-center justify-center"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2 mb-3 sm:mb-0">
          {/* Question Dots - More Compact */}
          <div className="flex flex-wrap gap-1 justify-center">
            {quiz.map((_, index) => (
              <button
                key={index}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all
                  ${index === currentQuestion 
                    ? 'bg-blue-600 text-white' 
                    : selectedAnswers[quiz[index]._id] !== undefined
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                  } hover:scale-105 active:scale-95`}
                onClick={() => setCurrentQuestion(index)}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full sm:w-auto order-3">
          {currentQuestion === totalQuestions - 1 ? (
            <button
              className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all shadow-sm hover:shadow active:scale-95 transform flex items-center justify-center"
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              {isSubmitted ? 'Submitted' : 'Submit Quiz'}
              {!isSubmitted && (
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ) : (
            <button
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm hover:shadow active:scale-95 transform flex items-center justify-center"
              onClick={handleNext}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Compact Quiz Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <p className="text-xs text-gray-600">Questions</p>
            <p className="text-base font-bold text-blue-700">{totalQuestions}</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <p className="text-xs text-gray-600">Answered</p>
            <p className="text-base font-bold text-green-700">{answeredCount}</p>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <p className="text-xs text-gray-600">Time</p>
            <p className="text-base font-bold text-purple-700">{formatTime(timeSpent)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};