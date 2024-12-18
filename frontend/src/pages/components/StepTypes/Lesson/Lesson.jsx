import React from 'react';
import { motion } from 'framer-motion';

export function Lesson({ step, stepIndex, steps, setSteps }) {
    const addContentBlock = () => {
        const newSteps = [...steps];
        if (!newSteps[stepIndex].content) {
            newSteps[stepIndex].content = [];
        }
        newSteps[stepIndex].content.push({
            type: 'text-block',
            text: ''
        });
        setSteps(newSteps);
    };

    const removeContentBlock = (contentIndex) => {
        const newSteps = [...steps];
        newSteps[stepIndex].content.splice(contentIndex, 1);
        setSteps(newSteps);
    };

    return (
        <div>
            <h3>Lesson Content</h3>
            {step.content && step.content.map((contentItem, contentIndex) => (
                <div key={contentIndex} className="mb-2 relative">
                    <motion.textarea
                        placeholder="Lesson Text"
                        value={contentItem.text}
                        onChange={(e) => {
                            const newSteps = [...steps];
                            newSteps[stepIndex].content[contentIndex].text = e.target.value;
                            setSteps(newSteps);
                        }}
                        style={{
                            width: '75%',
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
                    {step.content.length > 1 && (
                        <button
                            onClick={() => removeContentBlock(contentIndex)}
                            className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                        >
                            X
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={addContentBlock}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Add Text Block
            </button>
        </div>
    );
}