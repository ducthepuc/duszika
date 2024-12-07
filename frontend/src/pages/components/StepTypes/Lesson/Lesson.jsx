import React from 'react';

export function Lesson({ step, stepIndex, steps, setSteps }) {
    return (
        <div>
            <h3>Lesson Content</h3>
            {step.content.map((contentItem, contentIndex) => (
                <div key={contentIndex} className="mb-2">
          <textarea
              placeholder="Lesson Text"
              value={contentItem.text}
              onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[stepIndex].content[contentIndex].text = e.target.value;
                  setSteps(newSteps);
              }}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
                </div>
            ))}
        </div>
    );
}