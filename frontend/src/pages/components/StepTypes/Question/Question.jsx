import React from 'react';
import { AnswerOption } from './AnswerOption.jsx';

export function Question({
                             step,
                             stepIndex,
                             handleStepChange,
                             handleAnswerChange,
                             toggleCorrectAnswer,
                             removeAnswerOption,
                             addAnswerOption,
                         }) {
    return (
        <div>
            <h3>{step.questionType === 'true-false' ? 'True/False Question' : 'Multiple Choice Question'}</h3>
            <input
                type="text"
                placeholder="Question Text"
                value={step.questionText}
                onChange={(e) => handleStepChange(stepIndex, 'questionText', e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            {step.answers.map((answer, answerIndex) => (
                <AnswerOption
                    key={answerIndex}
                    answer={answer}
                    index={answerIndex}
                    questionType={step.questionType}
                    onTextChange={(value) => handleAnswerChange(stepIndex, answerIndex, value)}
                    onCorrectChange={() => toggleCorrectAnswer(stepIndex, answerIndex)}
                    onRemove={() => removeAnswerOption(stepIndex, answerIndex)}
                />
            ))}
            <button
                onClick={() => addAnswerOption(stepIndex)}
                className="px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
                Add Answer Option
            </button>
        </div>
    );
}