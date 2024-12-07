import React from 'react';
import {motion} from 'framer-motion';

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
          <motion.textarea
              placeholder={`Accepted Answer ${answerIndex + 1}`}
              value={answer.code}
              onChange={(e) => onChange(answerIndex, e.target.value)}
              style={{
                  width: '50%',
                  height: '250px',
                  padding: '12px',
                  marginBottom: '16px',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  backgroundColor: '#333333',
                  color: 'white',
                  outline: 'none',
                  resize: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  fontSize: '16px',
              }}
              whileHover={{
                  backgroundColor: '#444444',
              }}
              whileFocus={{
                  backgroundColor: '#555555',
                  border: '1px solid #FF7F4F',
              }}
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