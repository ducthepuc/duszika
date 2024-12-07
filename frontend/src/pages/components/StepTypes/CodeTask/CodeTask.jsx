import React from 'react';
import { AcceptedAnswers } from './AcceptedAnswers.jsx';
import { HighlightedElements } from './HighlightedElements.jsx';

export function CodeTask({
                             step,
                             stepIndex,
                             handleStepChange,
                             handleHighlightedElementChange,
                             removeHighlightedElement,
                             addAcceptedAnswer,
                             removeAcceptedAnswer,
                             handleAcceptedAnswerChange,
                         }) {
    return (
        <div>
            <h3>Coding Task</h3>
            <textarea
                placeholder="Task Description"
                value={step.task}
                onChange={(e) => handleStepChange(stepIndex, 'task', e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />

            <HighlightedElements
                elements={step.highlightedElements || []}
                onAdd={() => handleHighlightedElementChange(stepIndex, (step.highlightedElements || []).length, '')}
                onRemove={(elementIndex) => removeHighlightedElement(stepIndex, elementIndex)}
                onChange={(elementIndex, value) => handleHighlightedElementChange(stepIndex, elementIndex, value)}
            />

            <AcceptedAnswers
                answers={step.acceptedAnswers}
                onAdd={() => addAcceptedAnswer(stepIndex)}
                onRemove={(answerIndex) => removeAcceptedAnswer(stepIndex, answerIndex)}
                onChange={(answerIndex, value) => handleAcceptedAnswerChange(stepIndex, answerIndex, value)}
            />
        </div>
    );
}