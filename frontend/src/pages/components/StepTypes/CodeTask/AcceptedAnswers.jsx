import React from 'react';

export function AcceptedAnswers({
                                    answers,
                                    onAdd,
                                    onRemove,
                                    onChange
                                }) {
    return (
        <div>
            <h4>Accepted Answers</h4>
            {answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex items-center mb-2">
          <textarea
              placeholder={`Accepted Answer ${answerIndex + 1}`}
              value={answer.code}
              onChange={(e) => onChange(answerIndex, e.target.value)}
              className="w-4/5 p-2 mr-2 border border-gray-300 rounded-md"
          />
                    <button
                        onClick={() => onRemove(answerIndex)}
                        className="text-red-500 hover:text-red-700"
                    >
                        X
                    </button>
                </div>
            ))}
            <button
                onClick={onAdd}
                className="px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
                Add Accepted Answer
            </button>
        </div>
    );
}