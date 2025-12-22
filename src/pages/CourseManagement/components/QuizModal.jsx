import React from 'react';
import { X } from 'lucide-react';

const QuizModal = ({ quizData, setQuizData, handleQuizFieldChange, handleQuestionChange, addQuestion, removeQuestion, addOption, removeOption, handleOptionChange, setCorrectAnswer, handleQuizSubmit, isCreating, onCancel }) => {
  return (
    <div className="modal-backdrop-quiz fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Quiz</h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleQuizSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
                <input name="title" required value={quizData.title} onChange={handleQuizFieldChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., JavaScript Basics Quiz" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input name="durationMinutes" type="number" min="1" value={quizData.durationMinutes} onChange={handleQuizFieldChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks (auto)</label>
                  <input name="totalMarks" type="number" value={quizData.questions.reduce((s,q)=>s+(Number(q.marks)||0),0)} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50" />
                </div>
                <div className="w-40 flex items-end">
                  <label className="flex items-center gap-2"><input type="checkbox" name="isPublished" checked={quizData.isPublished} onChange={handleQuizFieldChange} className="rounded" /> <span className="text-sm">Publish</span></label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
                <div className="space-y-4">
                  {quizData.questions.map((q, qi) => (
                    <div key={qi} className="p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <input value={q.question} onChange={(e)=>handleQuestionChange(qi,'question',e.target.value)} placeholder={`Question ${qi+1}`} className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2" />
                          <textarea value={q.explanation} onChange={(e)=>handleQuestionChange(qi,'explanation',e.target.value)} placeholder="Explanation (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2" rows={2} />
                          <div className="flex items-center gap-2"><input type="number" min="0" value={q.marks} onChange={(e)=>handleQuestionChange(qi,'marks',e.target.value)} className="w-20 px-2 py-1 border rounded" /> <span className="text-sm text-gray-500">marks</span></div>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-2">
                          <button type="button" onClick={()=>addOption(qi)} className="text-sm px-2 py-1 bg-gray-100 rounded">+ Option</button>
                          <button type="button" onClick={()=>removeQuestion(qi)} className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded">Remove</button>
                        </div>
                      </div>

                      <div className="mt-3">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2 mb-2">
                            <input type="radio" name={`correct-${qi}`} checked={q.correctAnswerIndex===oi} onChange={()=>setCorrectAnswer(qi, oi)} />
                            <input value={opt} onChange={(e)=>handleOptionChange(qi, oi, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" placeholder={`Option ${oi+1}`} />
                            {q.options.length > 2 && (<button type="button" onClick={()=>removeOption(qi, oi)} className="px-2 py-1 text-sm text-red-600">Del</button>)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div>
                    <button type="button" onClick={addQuestion} className="px-4 py-2 bg-blue-50 text-blue-700 rounded">Add Question</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={isCreating} className="px-4 py-2 bg-green-600 text-white rounded">{isCreating ? 'Creating...' : 'Create Quiz'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
