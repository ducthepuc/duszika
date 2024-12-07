import React from 'react';

export function AnswerOption({
                                 answer,
                                 index,
                                 questionType,
                                 onTextChange,
                                 onCorrectChange,
                                 onRemove
                             }) {
    return (
        <div className="flex items-center mb-2">
            <input
                type="text"
                placeholder={`Answer ${index + 1}`}
                value={answer.text}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-4/5 p-2 mr-2 border border-gray-300 rounded-md"
            />
            <input
                type={questionType === 'true-false' ? 'radio' : 'checkbox'}
                checked={answer.correct}
                onChange={onCorrectChange}
                className="mr-2"
            />
            <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700"
            >
                X
            </button>
        </div>
    );
}