import React from 'react';
import { AcceptedAnswers } from './AcceptedAnswers.jsx';
import { ExampleCode } from './ExampleCode.jsx';
import { Help } from './Help.jsx';
import { motion } from 'framer-motion';

export function CodeTask({
    step,
    stepIndex,
    handleStepChange,
    addAcceptedAnswer,
    removeAcceptedAnswer,
    handleAcceptedAnswerChange,
}) {
    const handleExampleCodeChange = (value) => {
        handleStepChange(stepIndex, 'exampleCode', value);
    };

    const handleHelpChange = (value) => {
        handleStepChange(stepIndex, 'help', value);
    };

    return (
        <div>
            <h3>Coding Task</h3>
            <motion.textarea
                placeholder="Task Description (Use ** to highlight important text, e.g. **important**)"
                value={step.task}
                onChange={(e) => handleStepChange(stepIndex, 'task', e.target.value)}
                style={{
                    width: '75%',
                    height: '150px',
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

            <Help
                help={step.help}
                onChange={handleHelpChange}
            />

            <ExampleCode
                code={step.exampleCode || ''}
                onChange={handleExampleCodeChange}
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